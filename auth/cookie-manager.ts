import { CookieMap, Cookie } from 'bun';

export default class CookieManager {
  private cookies = new Map<string, CookieMap>();

  parseCookies(setCookieHeaders: string[]): Cookie[] {
    return setCookieHeaders.map((setCookieHeader) =>
      Cookie.parse(setCookieHeader),
    );
  }

  setCookies(url: string, setCookieHeaders: string[]) {
    const domain = new URL(url).hostname;

    if (!this.cookies.has(domain)) {
      this.cookies.set(domain, new CookieMap());
    }

    const cookieMap = this.cookies.get(domain)!;
    const cookies = this.parseCookies(setCookieHeaders);

    for (const cookie of cookies) {
      cookieMap.set(cookie);
    }
  }

  getCookieHeader(url: string): string {
    const domain = new URL(url).hostname;

    if (!this.cookies.has(domain)) {
      return '';
    }

    const cookieMap = this.cookies.get(domain)!;
    const cookies = Array.from(cookieMap.entries()).map(
      ([name, value]) => `${name}=${value}`,
    );
    return cookies.join('; ');
  }
}
