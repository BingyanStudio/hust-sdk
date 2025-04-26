import { CookieMap, Cookie } from 'bun';

export default class CookieManager {
  private cookies = new Map<string, Map<string, CookieMap>>();

  /** 打印当前存储的 cookies */
  watchCookies() {
    const cookieData: Array<{
      domain: string;
      path: string;
      name: string;
      value: string;
    }> = [];

    this.cookies.forEach((pathMap, domain) => {
      pathMap.forEach((cookieMap, path) => {
        cookieMap.forEach((value, name) => {
          cookieData.push({
            domain,
            path,
            name,
            value,
          });
        });
      });
    });

    if (cookieData.length === 0) {
      console.log('No cookies stored');
      return;
    }

    console.log('Cookie Manager - Current Cookies:');
    console.table(cookieData);
  }

  parseCookies(setCookieHeaders: string[]): Cookie[] {
    return setCookieHeaders.map((setCookieHeader) =>
      Cookie.parse(setCookieHeader),
    );
  }

  setCookies(url: string, setCookieHeaders: string[]) {
    const domain = new URL(url).hostname;

    if (!this.cookies.has(domain)) {
      this.cookies.set(domain, new Map());
    }

    const pathMap = this.cookies.get(domain)!;

    for (const header of setCookieHeaders) {
      const cookie = Cookie.parse(header);
      if (!pathMap.has(cookie.path)) {
        pathMap.set(cookie.path, new CookieMap());
      }
      const cookieMap = pathMap.get(cookie.path)!;
      cookieMap.set(cookie);
    }
  }

  getCookieHeader(url: string): string {
    const _url = new URL(url);
    const domain = _url.hostname;
    const urlPath = _url.pathname;

    if (!this.cookies.has(domain)) {
      return '';
    }

    const pathMap = this.cookies.get(domain)!;
    const validCookies: Array<{ name: string; value: string }> = [];
    const cookieMaps = Array.from(pathMap.entries())
      .filter(([path]) => {
        if (path === '/') {
          return true;
        }
        if (urlPath === path) {
          return true;
        }
        if (path.endsWith('/')) {
          return urlPath.startsWith(path);
        }
        return urlPath.startsWith(path + '/');
      })
      .map(([_, cookieMap]) => cookieMap);

    const setCookieHeaders = cookieMaps.flatMap((cookieMap) =>
      cookieMap.toSetCookieHeaders(),
    );

    // Bun 的 CookieMap 迭代不会自动过滤过期的 cookie，可能因为这个是基于服务器端的实现
    for (const header of setCookieHeaders) {
      const cookie = Cookie.parse(header);
      // cookie.isExpired() 不会校验 maxAge，需要单独判断 maxAge 为 0 的情况，这里其实就是针对 rememberMe 这个字段
      if (cookie && !cookie.isExpired() && cookie.maxAge !== 0) {
        validCookies.push({
          name: cookie.name,
          value: cookie.value,
        });
      }
    }

    return validCookies.map((c) => `${c.name}=${c.value}`).join('; ');
  }
}
