import { CookieMap, Cookie } from 'bun';
import { exists } from 'fs/promises';
import { resolve } from 'path';

interface StoredPathCookies {
  path: string;
  cookieHeaders: string[];
}

interface StoredDomainCookies {
  domain: string;
  paths: StoredPathCookies[];
}

type StoredCookies = StoredDomainCookies[];

export default class CookieManager {
  private cookies = new Map<string, Map<string, CookieMap>>();
  private storagePath: string;
  private initialLoadPromise: Promise<void>;

  constructor() {
    // 没有特殊需求使用默认的 cookie 存储路径即可
    // .gitignore 默认只忽略了名为 cookie.json 的文件
    // 如果使用了自定义的路径，注意一定不要添加到 git 中！
    this.storagePath = resolve(
      process.env.HUST_SDK_COOKIE_PATH || './cookie.json',
    );
    this.initialLoadPromise = this.loadCookiesFromStorage();
    this.initialLoadPromise.catch((err) =>
      console.error(
        `[CookieManager] Failed to load cookies from ${this.storagePath}:`,
        err,
      ),
    );
  }

  /**
   * 从 json 文件中恢复 cookie，仅在初始化实例时调用
   *
   * @private
   * @async
   * @returns {Promise<void>}
   */
  private async loadCookiesFromStorage(): Promise<void> {
    try {
      const fileExists = await exists(this.storagePath);
      if (!fileExists) {
        console.log(
          `[CookieManager] Cookie storage file not found at ${this.storagePath}. Initializing with empty cookies.`,
        );
        this.cookies = new Map<string, Map<string, CookieMap>>();
        return;
      }

      const storedCookiesData = await Bun.file(this.storagePath).json();
      const newCookies = new Map<string, Map<string, CookieMap>>();

      for (const domainData of storedCookiesData) {
        const pathMap = new Map<string, CookieMap>();
        for (const pathData of domainData.paths) {
          const cookieMap = new CookieMap();
          for (const headerString of pathData.cookieHeaders) {
            try {
              const cookie = Cookie.parse(headerString);
              // 过期的 cookie 不需要存储
              if (cookie && !cookie.isExpired() && cookie.maxAge !== 0) {
                cookieMap.set(cookie);
              }
            } catch (e) {
              console.warn(
                `[CookieManager] Failed to parse cookie header during load: "${headerString}"`,
                e,
              );
            }
          }
          if (cookieMap.size > 0) {
            pathMap.set(pathData.path, cookieMap);
          }
        }
        if (pathMap.size > 0) {
          newCookies.set(domainData.domain, pathMap);
        }
      }
      this.cookies = newCookies;
    } catch (error) {
      console.error(
        `[CookieManager] Error loading cookies from ${this.storagePath}:`,
        error,
      );
      // 如果读取失败，初始化为空
      this.cookies = new Map<string, Map<string, CookieMap>>();
    }
  }

  /**
   * 将 cookies 保存到 json 文件中
   *
   * @private
   * @async
   * @returns {Promise<void>}
   */
  private async saveCookiesToStorage(): Promise<void> {
    try {
      const storableCookies: StoredCookies = [];
      this.cookies.forEach((pathMap, domain) => {
        const paths: StoredPathCookies[] = [];
        pathMap.forEach((cookieMap, path) => {
          const cookieHeaders = cookieMap.toSetCookieHeaders();
          if (cookieHeaders.length > 0) {
            paths.push({ path, cookieHeaders });
          }
        });
        if (paths.length > 0) {
          storableCookies.push({ domain, paths });
        }
      });
      await Bun.write(
        this.storagePath,
        JSON.stringify(storableCookies, null, 2),
      );
    } catch (error) {
      console.error(
        `[CookieManager] Error saving cookies to ${this.storagePath}:`,
        error,
      );
    }
  }

  /** 打印当前存储的 cookies */
  async watchCookies() {
    await this.initialLoadPromise;
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
      console.log('[CookieManager] No cookies stored');
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

  async setCookies(url: string, setCookieHeaders: string[]) {
    await this.initialLoadPromise;
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
    await this.saveCookiesToStorage();
  }

  async getCookieHeader(url: string): Promise<string> {
    await this.initialLoadPromise;
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
