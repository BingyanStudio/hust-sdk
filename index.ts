import CookieManager from '@/auth/cookie-manager';
import CASAuth from '@/auth/cas';
import type { LoginInfo } from './types/auth';

export default class HUST {
  private readonly cookieManager: CookieManager;
  private readonly auth: CASAuth;

  constructor() {
    this.cookieManager = new CookieManager();
    this.auth = new CASAuth(this.cookieManager);
  }

  /**
   * 登录
   */
  async login(info: LoginInfo): Promise<boolean> {
    return await this.auth.login(info);
  }

  /**
   * 检查登录状态
   */
  async isLoggedIn(): Promise<boolean> {
    return await this.auth.checkLoginStatus();
  }

  /**
   * 注销
   */
  async logout(): Promise<boolean> {
    return await this.auth.logout();
  }

  /**
   * 获取 CookieManager
   */
  getCookieManager(): CookieManager {
    return this.cookieManager;
  }
}
