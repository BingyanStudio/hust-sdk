import { describe, expect, test, beforeEach } from 'bun:test';
import CookieManager from '@/auth/cookie-manager';
import { Cookie } from 'bun';

describe('CookieManager', () => {
  let cookieManager: CookieManager;

  beforeEach(() => {
    cookieManager = new CookieManager();
  });

  describe('parseCookies', () => {
    test('should parse a single cookie header', () => {
      const setCookieHeader = 'sessionId=abc123; Path=/; HttpOnly; Secure';
      const cookies = cookieManager.parseCookies([setCookieHeader]);

      expect(cookies).toHaveLength(1);
      expect(cookies[0]).toBeInstanceOf(Cookie);
      expect(cookies[0]!.name).toBe('sessionId');
      expect(cookies[0]!.value).toBe('abc123');
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
    test('should add cookies for a new domain', () => {
      const url = 'https://example.com/path';
      const setCookieHeaders = ['sessionId=abc123; Path=/'];

      cookieManager.setCookies(url, setCookieHeaders);

      const cookieHeader = cookieManager.getCookieHeader(url);
      expect(cookieHeader).toBe('sessionId=abc123');
    });

    test('should add multiple cookies for a domain', () => {
      const url = 'https://example.com/path';
      const setCookieHeaders = [
        'sessionId=abc123; Path=/',
        'user=john; Path=/api',
      ];

      cookieManager.setCookies(url, setCookieHeaders);

      const cookieHeader = cookieManager.getCookieHeader(url);
      expect(cookieHeader).toContain('sessionId=abc123');
      expect(cookieHeader).toContain('user=john');
    });

    test('should add cookies to existing domain', () => {
      const url = 'https://example.com/path';
      cookieManager.setCookies(url, ['sessionId=abc123; Path=/']);
      cookieManager.setCookies(url, ['user=john; Path=/api']);

      const cookieHeader = cookieManager.getCookieHeader(url);
      expect(cookieHeader).toContain('sessionId=abc123');
      expect(cookieHeader).toContain('user=john');
    });

    test('should handle different domains separately', () => {
      cookieManager.setCookies('https://example.com', ['site=example; Path=/']);
      cookieManager.setCookies('https://test.com', ['site=test; Path=/']);

      expect(cookieManager.getCookieHeader('https://example.com')).toBe(
        'site=example',
      );
      expect(cookieManager.getCookieHeader('https://test.com')).toBe(
        'site=test',
      );
    });

    test('should update existing cookies', () => {
      const url = 'https://example.com/path';
      cookieManager.setCookies(url, ['sessionId=abc123; Path=/']);
      cookieManager.setCookies(url, ['sessionId=xyz789; Path=/']);

      const cookieHeader = cookieManager.getCookieHeader(url);
      expect(cookieHeader).toBe('sessionId=xyz789');
    });
  });

  describe('getCookieHeader', () => {
    test('should return empty string for non-existent domain', () => {
      const cookieHeader = cookieManager.getCookieHeader(
        'https://nonexistent.com',
      );
      expect(cookieHeader).toBe('');
    });

    test('should return cookies as header string', () => {
      const url = 'https://example.com/path';
      cookieManager.setCookies(url, [
        'sessionId=abc123; Path=/',
        'user=john; Path=/api',
      ]);

      const cookieHeader = cookieManager.getCookieHeader(url);
      expect(typeof cookieHeader).toBe('string');
      expect(cookieHeader.split('; ').length).toBe(2);
    });

    test('should only return cookies for the specified domain', () => {
      cookieManager.setCookies('https://example.com', ['site=example; Path=/']);
      cookieManager.setCookies('https://sub.example.com', [
        'subdomain=true; Path=/',
      ]);

      expect(cookieManager.getCookieHeader('https://example.com')).toBe(
        'site=example',
      );
      expect(cookieManager.getCookieHeader('https://sub.example.com')).toBe(
        'subdomain=true',
      );
    });
  });
});
