import { describe, expect, test, beforeEach, afterEach } from 'bun:test';
import CookieManager from '@/auth/cookie-manager';
import { Cookie } from 'bun';
import { exists, unlink, mkdir } from 'fs/promises';

describe('CookieManager', () => {
  let cookieManager: CookieManager;
  let tempCookiePath: string;

  beforeEach(async () => {
    tempCookiePath = `./test-cookie-${Date.now()}-${Math.random().toString(36).substring(2)}.json`;
    process.env.HUST_SDK_COOKIE_PATH = tempCookiePath;
    cookieManager = new CookieManager();

    await new Promise((resolve) => setTimeout(resolve, 50));
  });

  afterEach(async () => {
    if (await exists(tempCookiePath)) {
      await unlink(tempCookiePath);
    }
    delete process.env.HUST_SDK_COOKIE_PATH;
  });

  describe('parseCookies', () => {
    test('should parse a single cookie header', () => {
      const setCookieHeader = 'sessionId=abc123; Path=/; HttpOnly; Secure';
      const cookies = cookieManager.parseCookies([setCookieHeader]);

      expect(cookies).toHaveLength(1);
      expect(cookies[0]).toBeInstanceOf(Cookie);
      expect(cookies[0]!.name).toBe('sessionId');
      expect(cookies[0]!.value).toBe('abc123');
      expect(cookies[0]!.path).toBe('/');
      expect(cookies[0]!.httpOnly).toBe(true);
      expect(cookies[0]!.secure).toBe(true);
    });

    test('should parse multiple cookie headers', () => {
      const setCookieHeaders = [
        'sessionId=abc123; Path=/; HttpOnly',
        'user=john; Path=/api; Secure',
      ];

      const cookies = cookieManager.parseCookies(setCookieHeaders);

      expect(cookies).toHaveLength(2);
      expect(cookies[0]!.name).toBe('sessionId');
      expect(cookies[1]!.name).toBe('user');
    });
  });

  describe('setCookies', () => {
    test('should add cookies for a new domain', async () => {
      const url = 'https://example.com/path';
      const setCookieHeaders = ['sessionId=abc123; Path=/'];

      await cookieManager.setCookies(url, setCookieHeaders);

      const cookieHeader = await cookieManager.getCookieHeader(url);
      expect(cookieHeader).toBe('sessionId=abc123');
    });

    test('should add multiple cookies for a domain', async () => {
      const url = 'https://example.com/path';
      const setCookieHeaders = [
        'sessionId=abc123; Path=/',
        'user=john; Path=/path',
      ];

      await cookieManager.setCookies(url, setCookieHeaders);

      const cookieHeader = await cookieManager.getCookieHeader(url);
      expect(cookieHeader).toContain('sessionId=abc123');
      expect(cookieHeader).toContain('user=john');
    });

    test('should add cookies to existing domain', async () => {
      const url = 'https://example.com/path';
      await cookieManager.setCookies(url, ['sessionId=abc123; Path=/']);
      await cookieManager.setCookies(url, ['user=john; Path=/path']);

      const cookieHeader = await cookieManager.getCookieHeader(url);
      expect(cookieHeader).toContain('sessionId=abc123');
      expect(cookieHeader).toContain('user=john');
    });

    test('should handle different domains separately', async () => {
      await cookieManager.setCookies('https://example.com', [
        'site=example; Path=/',
      ]);
      await cookieManager.setCookies('https://test.com', ['site=test; Path=/']);

      expect(await cookieManager.getCookieHeader('https://example.com')).toBe(
        'site=example',
      );
      expect(await cookieManager.getCookieHeader('https://test.com')).toBe(
        'site=test',
      );
    });

    test('should update existing cookies', async () => {
      const url = 'https://example.com/path';
      await cookieManager.setCookies(url, ['sessionId=abc123; Path=/']);
      await cookieManager.setCookies(url, ['sessionId=xyz789; Path=/']);

      const cookieHeader = await cookieManager.getCookieHeader(url);
      expect(cookieHeader).toBe('sessionId=xyz789');
    });
  });

  describe('getCookieHeader', () => {
    test('should return empty string for non-existent domain', async () => {
      const cookieHeader = await cookieManager.getCookieHeader(
        'https://nonexistent.com',
      );
      expect(cookieHeader).toBe('');
    });

    test('should return cookies as header string', async () => {
      const url = 'https://example.com/api/users';
      await cookieManager.setCookies(url, [
        'sessionId=abc123; Path=/',
        'user=john; Path=/api',
      ]);

      const cookieHeader = await cookieManager.getCookieHeader(url);
      expect(typeof cookieHeader).toBe('string');
      expect(cookieHeader.split('; ').length).toBe(2);
    });

    test('should only return cookies for the specified domain', async () => {
      await cookieManager.setCookies('https://example.com', [
        'site=example; Path=/',
      ]);
      await cookieManager.setCookies('https://sub.example.com', [
        'subdomain=true; Path=/',
      ]);

      expect(await cookieManager.getCookieHeader('https://example.com')).toBe(
        'site=example',
      );
      expect(
        await cookieManager.getCookieHeader('https://sub.example.com'),
      ).toBe('subdomain=true');
    });

    test('should not include cookies that expired', async () => {
      const url = 'https://example.com/path';
      const pastDate = new Date();
      pastDate.setDate(pastDate.getDate() - 1); // 昨天

      await cookieManager.setCookies(url, [
        `sessionId=abc123; Path=/; Expires=${pastDate.toUTCString()}`,
        `user=john; Path=/api; Expires=${pastDate.toUTCString()}`,
      ]);

      const expiredCookieHeader = await cookieManager.getCookieHeader(url);
      expect(expiredCookieHeader).toBe('');
    });

    test('should only return cookies where URL path starts with cookie path', async () => {
      await cookieManager.setCookies('https://example.com', [
        'root=true; Path=/',
        'api=true; Path=/api',
        'docs=true; Path=/docs',
      ]);

      expect(await cookieManager.getCookieHeader('https://example.com')).toBe(
        'root=true',
      );

      expect(
        await cookieManager.getCookieHeader('https://example.com/api/users'),
      ).toContain('root=true');
      expect(
        await cookieManager.getCookieHeader('https://example.com/api/users'),
      ).toContain('api=true');
      expect(
        await cookieManager.getCookieHeader('https://example.com/api/users'),
      ).not.toContain('docs=true');

      expect(
        await cookieManager.getCookieHeader('https://example.com/docs/guide'),
      ).toContain('root=true');
      expect(
        await cookieManager.getCookieHeader('https://example.com/docs/guide'),
      ).toContain('docs=true');
      expect(
        await cookieManager.getCookieHeader('https://example.com/docs/guide'),
      ).not.toContain('api=true');
    });

    test('should handle nested path cookies correctly', async () => {
      await cookieManager.setCookies('https://example.com', [
        'root=true; Path=/',
        'api=true; Path=/api',
        'apiV1=true; Path=/api/v1/',
      ]);

      const rootCookie = await cookieManager.getCookieHeader(
        'https://example.com',
      );
      expect(rootCookie).toBe('root=true');

      const apiCookie = await cookieManager.getCookieHeader(
        'https://example.com/api',
      );
      expect(apiCookie).toContain('root=true');
      expect(apiCookie).toContain('api=true');
      expect(apiCookie).not.toContain('apiV1=true');

      const apiV1Cookie = await cookieManager.getCookieHeader(
        'https://example.com/api/v1',
      );
      expect(apiV1Cookie).toContain('root=true');
      expect(apiV1Cookie).toContain('api=true');
      expect(apiV1Cookie).not.toContain('apiV1=true');

      const apiV1UsersCookie = await cookieManager.getCookieHeader(
        'https://example.com/api/v1/users',
      );
      expect(apiV1UsersCookie).toContain('root=true');
      expect(apiV1UsersCookie).toContain('api=true');
      expect(apiV1UsersCookie).toContain('apiV1=true');
    });

    test('should handle exact path matching', async () => {
      await cookieManager.setCookies('https://example.com', [
        'exact=true; Path=/exact',
      ]);

      expect(
        await cookieManager.getCookieHeader('https://example.com/exact'),
      ).toBe('exact=true');

      expect(
        await cookieManager.getCookieHeader('https://example.com/exact/sub'),
      ).toBe('exact=true');

      expect(
        await cookieManager.getCookieHeader('https://example.com/exactplus'),
      ).toBe('');
    });
  });

  describe('Persistence', () => {
    test('should save cookies to file and load them back', async () => {
      const url = 'https://example.com/path';
      const setCookieHeaders = ['sessionId=abc123; Path=/'];

      await cookieManager.setCookies(url, setCookieHeaders);

      delete process.env.HUST_SDK_COOKIE_PATH;
      process.env.HUST_SDK_COOKIE_PATH = tempCookiePath;
      const newCookieManager = new CookieManager();
      // 等待初始化完成
      await new Promise((resolve) => setTimeout(resolve, 100));

      const cookieHeader = await newCookieManager.getCookieHeader(url);
      expect(cookieHeader).toBe('sessionId=abc123');
    });

    test('should handle non-existent cookie file', async () => {
      const nonExistentPath = './non-existent-file.json';

      if (await exists(nonExistentPath)) {
        await unlink(nonExistentPath);
      }

      process.env.HUST_SDK_COOKIE_PATH = nonExistentPath;
      const newCookieManager = new CookieManager();

      await new Promise((resolve) => setTimeout(resolve, 50));

      const url = 'https://example.com';
      await newCookieManager.setCookies(url, ['test=value; Path=/']);

      const cookieHeader = await newCookieManager.getCookieHeader(url);
      expect(cookieHeader).toBe('test=value');

      if (await exists(nonExistentPath)) {
        await unlink(nonExistentPath);
      }
    });

    test('should filter expired cookies when loading from storage', async () => {
      const url = 'https://example.com';
      const pastDate = new Date();
      pastDate.setDate(pastDate.getDate() - 1); // 昨天

      const futureDate = new Date();
      futureDate.setFullYear(futureDate.getFullYear() + 1); // 明年

      await cookieManager.setCookies(url, [
        `expired=true; Path=/; Expires=${pastDate.toUTCString()}`,
        `valid=true; Path=/; Expires=${futureDate.toUTCString()}`,
      ]);

      delete process.env.HUST_SDK_COOKIE_PATH;
      process.env.HUST_SDK_COOKIE_PATH = tempCookiePath;
      const newCookieManager = new CookieManager();

      await new Promise((resolve) => setTimeout(resolve, 100));

      const cookieHeader = await newCookieManager.getCookieHeader(url);
      expect(cookieHeader).toBe('valid=true');
      expect(cookieHeader).not.toContain('expired=true');
    });
  });
});
