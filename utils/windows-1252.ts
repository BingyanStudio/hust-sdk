/*! windows-1252 encode 方法抄的这个： https://mths.be/windows-1252 v3.0.4 by @mathias | MIT license */

const brokenStr =
  'jsonp_8e0b97a20f2a4b80b2677e2bf8257a39({"result":"<p style=\"margin-top:5px;margin-bottom:5px;text-indent:37px;line-height:32px\"><span style=\"font-family: ä»¿å®‹_GB2312;font-size: 19px\"><span style=\"font-family:ä»¿å®‹_GB2312\">æ ¹æ®ã€ŠåŽä¸­ç§‘æŠ€å¤§å­¦æ ¡é¢†å¯¼æŽ¥å¾…æ—¥å·¥ä½œæ–¹æ¡ˆã€‹ï¼ˆæ ¡åŠžå‘ã€”</span><span style=\"font-family:ä»¿å®‹_GB2312\">2016ã€•1å·ï¼‰ï¼ŒçŽ°å°†æœ¬æ¬¡â€œæ ¡é¢†å¯¼æŽ¥å¾…æ—¥â€æœ‰å…³å·¥ä½œé¢„å‘Šå¦‚ä¸‹ï¼š</span></span></p><p style=\"margin-top:8px;margin-bottom:8px;text-indent:37px;line-height:27px\"><span style=\"font-family: ä»¿å®‹_GB2312;font-size: 19px\">ä¸€ã€æŽ¥å¾…æ ¡é¢†å¯¼</span></p><p style=\"margin-top:8px;margin-bottom:8px;text-indent:37px;line-height:27px\"><span style=\"font-family: ä»¿å®‹_GB2312;font-size: 19px\"><span style=\"font-family:ä»¿å®‹_GB2312\">æ¹›æ¯…é’</span><span style=\"font-family:Arial\">&nbsp; </span><span style=\"font-family:ä»¿å®‹_GB2312\">å‰¯æ ¡é•¿</span></span></p><p style=\"margin-top:8px;margin-bottom:8px;text-indent:37px;line-height:27px\"><span style=\"font-family: ä»¿å®‹_GB2312;font-size: 19px\">äºŒã€æŽ¥å¾…æ—¶é—´åŠåœ°ç‚¹</span></p><p style=\"margin-top:5px;margin-bottom:5px;text-indent:37px;line-height:32px\"><span style=\"font-family: ä»¿å®‹_GB2312;font-size: 19px\">æŽ¥å¾…æ—¶é—´ï¼š</span><span style=\"font-family: ä»¿å®‹_GB2312;font-size: 19px\">4æœˆ30æ—¥ï¼ˆå‘¨ä¸‰ï¼‰14:30</span></p><p style=\"margin-top:5px;margin-bottom:5px;text-indent:37px;line-height:32px\"><span style=\"font-family: ä»¿å®‹_GB2312;font-size: 19px\">æŽ¥å¾…åœ°ç‚¹ï¼šæ ¹æ®é¢„çº¦æƒ…å†µå¦è¡Œé€šçŸ¥</span></p><p style=\"margin-top:8px;margin-bottom:8px;text-indent:37px;line-height:27px\"><span style=\"font-family: ä»¿å®‹_GB2312;font-size: 19px\">ä¸‰ã€æŽ¥å¾…å·¥ä½œè¯´æ˜Ž</span></p><p style=\"margin-top:5px;margin-bottom:5px;text-indent:37px;line-height:32px\"><span style=\"font-family: ä»¿å®‹_GB2312;font-size: 19px\">1.ä¸ºæé«˜æŽ¥å¾…å·¥ä½œæ•ˆçŽ‡ï¼Œè¯·å‚åŠ æ ¡é¢†å¯¼æŽ¥å¾…æ—¥çš„å¸ˆç”Ÿå‘˜å·¥é€šè¿‡</span><span style=\"font-family: ËŽÌ¥;font-size: 19px\">â€œ</span><span style=\"font-family: ä»¿å®‹_GB2312;font-size: 19px\">åŽä¸­ç§‘æŠ€å¤§å­¦æ ¡é¢†å¯¼æŽ¥å¾…æ—¥é¢„çº¦ç³»ç»Ÿ</span><span style=\"font-family: ËŽÌ¥;font-size: 19px\">â€</span><span style=\"font-family: ä»¿å®‹_GB2312;font-size: 19px\">æå‰é¢„çº¦ï¼ˆç³»ç»Ÿç½‘å€ä¸ºï¼š</span><span style=\"font-family: ä»¿å®‹_GB2312;font-size: 19px\">&nbsp;</span><a href=\"http://advise.hust.edu.cn/xinfang/#/web/reservation\"><span style=\"text-decoration:underline;\"><span style=\"font-family: ä»¿å®‹_GB2312;color: rgb(5, 99, 193);font-size: 19px\">http://advise.hust.edu.cn/xinfang/#/web/reservation</span></span></a><span style=\"font-family: ä»¿å®‹_GB2312;font-size: 19px\">&nbsp;</span><span style=\"font-family: ä»¿å®‹_GB2312;font-size: 19px\">ï¼‰ï¼Œé¢„çº¦æˆªæ­¢æ—¶é—´ä¸º</span><span style=\"font-family: ä»¿å®‹_GB2312;font-size: 19px\">4</span><span style=\"font-family: ä»¿å®‹_GB2312;font-size: 19px\">æœˆ</span><span style=\"font-family: ä»¿å®‹_GB2312;font-size: 19px\">29</span><span style=\"font-family: ä»¿å®‹_GB2312;font-size: 19px\">æ—¥ï¼ˆ</span><span style=\"font-family: ä»¿å®‹_GB2312;font-size: 19px\">å‘¨äºŒ</span><span style=\"font-family: ä»¿å®‹_GB2312;font-size: 19px\"><span style=\"font-family:ä»¿å®‹_GB2312\">ï¼‰</span><span style=\"font-family:ä»¿å®‹_GB2312\">12:00ã€‚å­¦æ ¡å°†æ ¹æ®é¢„çº¦æƒ…å†µå®‰æŽ’æŽ¥å¾…å·¥ä½œã€‚</span></span></p><p style=\"margin-top:5px;margin-bottom:5px;text-indent:37px;line-height:32px\"><span style=\"font-family: ä»¿å®‹_GB2312;font-size: 19px\">2</span><span style=\"font-family: ä»¿å®‹_GB2312;font-size: 19px\"><span style=\"font-family:ä»¿å®‹_GB2312\">.</span><span style=\"font-family:Arial\">&nbsp;</span><span style=\"font-family:ä»¿å®‹_GB2312\">è”ç³»äººï¼šä½•æ–¹çŽ²ï¼›è”ç³»ç”µè¯ï¼š87542201ã€‚</span></span></p><p style=\"margin-top:5px;margin-bottom:5px;text-indent:37px;line-height:32px\"><span style=\"font-family: ä»¿å®‹_GB2312;font-size: 19px\">ä»¥ä¸Šå®‰æŽ’å¦‚æœ‰å˜åŠ¨å°†å¦è¡Œé€šçŸ¥ã€‚</span><span style=\"font-family: Arial; font-size: 19px;\">&nbsp;</span></p><p style=\"margin-top:5px;margin-bottom:5px;text-indent:37px;line-height:32px\"><span style=\"font-family: ä»¿å®‹_GB2312;font-size: 19px\"><span style=\"font-family:Arial\">&nbsp;</span></span></p><p style=\"margin-top:5px;margin-right:37px;margin-bottom:5px;text-indent:37px;text-align:center;line-height:32px\"><span style=\"font-family: ä»¿å®‹_GB2312;font-size: 19px\"><span style=\"font-family:Arial\">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp; &nbsp;&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;</span></span><span style=\"font-family: ä»¿å®‹_GB2312;font-size: 19px\">&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;</span><span style=\"font-family: ä»¿å®‹_GB2312;font-size: 19px\">ä¿¡è®¿åŠžå…¬å®¤</span></p><p style=\"margin-top:5px;margin-bottom:5px;text-align:center\"><span style=\"font-family: ä»¿å®‹_GB2312;font-size: 19px\"><span style=\"font-family:Arial\">&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;</span><span style=\"font-family:ä»¿å®‹_GB2312\">202</span></span><span style=\"font-family: ä»¿å®‹_GB2312;font-size: 19px\">5</span><span style=\"font-family: ä»¿å®‹_GB2312;font-size: 19px\">å¹´</span><span style=\"font-family: ä»¿å®‹_GB2312;font-size: 19px\">4</span><span style=\"font-family: ä»¿å®‹_GB2312;font-size: 19px\">æœˆ</span><span style=\"font-family: ä»¿å®‹_GB2312;font-size: 19px\">27</span><span style=\"font-family: ä»¿å®‹_GB2312;font-size: 19px\"><span style=\"font-family:ä»¿å®‹_GB2312\">æ—¥</span><span style=\"font-family:Arial\">&nbsp;</span></span></p><p><br/></p>"})';

const INDEX_BY_CODE_POINT = new Map([
  [129, 1],
  [141, 13],
  [143, 15],
  [144, 16],
  [157, 29],
  [160, 32],
  [161, 33],
  [162, 34],
  [163, 35],
  [164, 36],
  [165, 37],
  [166, 38],
  [167, 39],
  [168, 40],
  [169, 41],
  [170, 42],
  [171, 43],
  [172, 44],
  [173, 45],
  [174, 46],
  [175, 47],
  [176, 48],
  [177, 49],
  [178, 50],
  [179, 51],
  [180, 52],
  [181, 53],
  [182, 54],
  [183, 55],
  [184, 56],
  [185, 57],
  [186, 58],
  [187, 59],
  [188, 60],
  [189, 61],
  [190, 62],
  [191, 63],
  [192, 64],
  [193, 65],
  [194, 66],
  [195, 67],
  [196, 68],
  [197, 69],
  [198, 70],
  [199, 71],
  [200, 72],
  [201, 73],
  [202, 74],
  [203, 75],
  [204, 76],
  [205, 77],
  [206, 78],
  [207, 79],
  [208, 80],
  [209, 81],
  [210, 82],
  [211, 83],
  [212, 84],
  [213, 85],
  [214, 86],
  [215, 87],
  [216, 88],
  [217, 89],
  [218, 90],
  [219, 91],
  [220, 92],
  [221, 93],
  [222, 94],
  [223, 95],
  [224, 96],
  [225, 97],
  [226, 98],
  [227, 99],
  [228, 100],
  [229, 101],
  [230, 102],
  [231, 103],
  [232, 104],
  [233, 105],
  [234, 106],
  [235, 107],
  [236, 108],
  [237, 109],
  [238, 110],
  [239, 111],
  [240, 112],
  [241, 113],
  [242, 114],
  [243, 115],
  [244, 116],
  [245, 117],
  [246, 118],
  [247, 119],
  [248, 120],
  [249, 121],
  [250, 122],
  [251, 123],
  [252, 124],
  [253, 125],
  [254, 126],
  [255, 127],
  [338, 12],
  [339, 28],
  [352, 10],
  [353, 26],
  [376, 31],
  [381, 14],
  [382, 30],
  [402, 3],
  [710, 8],
  [732, 24],
  [8211, 22],
  [8212, 23],
  [8216, 17],
  [8217, 18],
  [8218, 2],
  [8220, 19],
  [8221, 20],
  [8222, 4],
  [8224, 6],
  [8225, 7],
  [8226, 21],
  [8230, 5],
  [8240, 9],
  [8249, 11],
  [8250, 27],
  [8364, 0],
  [8482, 25],
]);

export const windows1252Encode = (input: string) => {
  const length = input.length;
  const result = new Uint8Array(length);
  for (let index = 0; index < length; index++) {
    const codePoint = input.charCodeAt(index);

    if (0x00 <= codePoint && codePoint <= 0x7f) {
      result[index] = codePoint;
      continue;
    }

    if (INDEX_BY_CODE_POINT.has(codePoint)) {
      const pointer = INDEX_BY_CODE_POINT.get(codePoint);
      result[index] = pointer! + 0x80;
    }
  }
  return result;
};

console.log(new TextDecoder().decode(windows1252Encode(brokenStr)));
