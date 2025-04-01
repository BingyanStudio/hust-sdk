import sharp from 'sharp';
import { createWorker, PSM } from 'tesseract.js';
import GifFrames from 'gif-frames';

async function extractAllFrames(imagePath: string) {
  const frameData = await GifFrames({
    url: imagePath,
    frames: 'all',
    outputType: 'png',
  });

  const processedFrames = await Promise.all(
    frameData.map(async (frame: any, index: number) => {
      const buffer = await new Promise<Buffer>((resolve) => {
        const buffers: Buffer[] = [];
        frame.getImage().pipe(
          new (require('stream').Writable)({
            write(chunk: Buffer, encoding: string, callback: Function) {
              buffers.push(chunk);
              callback();
            },
            final(callback: Function) {
              resolve(Buffer.concat(buffers));
              callback();
            },
          }),
        );
      });

      return await sharp(buffer)
        .grayscale()
        .median(2) // 中值滤波
        .threshold(240) // 实测阈值设高一些，因为有些图的数字很淡
        .toBuffer();
    }),
  );

  return processedFrames;
}

async function mergeFrames(frames: Buffer[]) {
  if (frames.length === 0) return Buffer.from([]);

  const metadata = await sharp(frames[0]).metadata();
  const width = metadata.width || 90;
  const height = metadata.height || 58;

  const framePixelData = await Promise.all(
    frames.map(async (frame, i) => {
      const singleChannelFrame = await sharp(frame)
        .extractChannel(0) // 提取单通道
        .raw()
        .toBuffer();
      return singleChannelFrame;
    }),
  );

  let mergedImage = Buffer.alloc(width * height, 255);

  for (let i = 0; i < framePixelData.length; i++) {
    const pixelData = framePixelData[i]!;

    // 合并像素: 如果任一帧对应位置有黑色像素，结果就是黑色
    for (let j = 0; j < pixelData.length; j++) {
      if (pixelData[j]! < 128) {
        mergedImage[j] = 0;
      }
    }
  }

  const finalImage = sharp(mergedImage, {
    raw: {
      width,
      height,
      channels: 1,
    },
  });

  return await finalImage.png().toBuffer();
}

async function recognizeCode(
  worker: any,
  mergedImage: Buffer,
): Promise<string | null> {
  // 配置OCR参数
  await worker.setParameters({
    tessedit_char_whitelist: '0123456789',
    tessedit_pageseg_mode: PSM.SINGLE_LINE,
  });

  try {
    const {
      data: { text },
    } = await worker.recognize(mergedImage);
    const code = text.trim().replace(/\D/g, '');

    if (code.length === 4 && /^\d{4}$/.test(code)) {
      return code;
    }
  } catch (error) {
    console.error('识别错误:', error);
  }

  return null; // 返回 null 表示识别失败
}

export async function recognizeGifCaptcha(imagePath: string) {
  const worker = await createWorker('eng');
  try {
    const allFrames = await extractAllFrames(imagePath);
    const mergedImage = await mergeFrames(allFrames);
    return await recognizeCode(worker, mergedImage);
  } finally {
    await worker.terminate();
  }
}
