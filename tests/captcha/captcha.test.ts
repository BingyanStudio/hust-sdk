import { describe, test, expect } from 'bun:test';
import { recognizeGifCaptcha } from '../../utils/dynamic-code';
import path from 'path';
import fs from 'fs';

// Test asset paths
const testAssets = {
  code: path.resolve(__dirname, 'code.jpeg'),
  code1: path.resolve(__dirname, 'code1.jpeg'),
  code2: path.resolve(__dirname, 'code2.jpeg'),
  code3: path.resolve(__dirname, 'code3.jpeg'),
  code4: path.resolve(__dirname, 'code4.jpeg'),
  code5: path.resolve(__dirname, 'code5.jpeg'),
  code6: path.resolve(__dirname, 'code6.jpeg'),
  code7: path.resolve(__dirname, 'code7.jpeg'),
};

describe('Captcha Recognition', () => {
  const TIMEOUT = 30000;

  test(
    '7293',
    async () => {
      const code = await recognizeGifCaptcha(testAssets.code);
      expect(code).toBe('7293');
    },
    TIMEOUT,
  );

  test(
    '6512',
    async () => {
      const code = await recognizeGifCaptcha(testAssets.code1);
      expect(code).toBe('6512');
    },
    TIMEOUT,
  );

  test(
    '5503',
    async () => {
      const code = await recognizeGifCaptcha(testAssets.code2);
      expect(code).toBe('5503');
    },
    TIMEOUT,
  );

  test(
    '1558',
    async () => {
      const code = await recognizeGifCaptcha(testAssets.code3);
      expect(code).toBe('1558');
    },
    TIMEOUT,
  );

  test(
    '6474',
    async () => {
      const code = await recognizeGifCaptcha(testAssets.code4);
      expect(code).toBe('6474');
    },
    TIMEOUT,
  );

  test(
    '5368',
    async () => {
      const code = await recognizeGifCaptcha(testAssets.code5);
      expect(code).toBe('5368');
    },
    TIMEOUT,
  );

  test(
    '8637',
    async () => {
      const code = await recognizeGifCaptcha(testAssets.code6);
      expect(code).toBe('8637');
    },
    TIMEOUT,
  );

  test(
    '9436',
    async () => {
      const code = await recognizeGifCaptcha(testAssets.code7);
      expect(code).toBe('9436');
    },
    TIMEOUT,
  );
});
