import CookieManager from '@/auth/cookie-manager';
import CASAuth from '@/auth/cas';
import type { LoginInfo, PhoneCodeCallback } from '@/types/auth';
import NewsClient from '@/clients/news-client';
import { Client, type HUSTConfig } from '@/types/hust';
import { isAuthError } from './utils/request';
import { getPhoneCodeFromConsole } from './utils/console-input';

export default class HUST {
  private readonly cookieManager: CookieManager;
  private readonly auth: CASAuth;
  private loginInfo: LoginInfo | null = null;
  private isLoggingIn = false;
  private loginCheckTimer: NodeJS.Timeout | null = null;
  private initialLoginPromise: Promise<boolean> | null = null;
  private isInitialLogging: boolean = false;
  private phoneCodeCallback: PhoneCodeCallback = getPhoneCodeFromConsole;

  // 配置项
  private maxLoginRetries: number = 10;
  private loginCheckIntervalTime: number = 60000;
  private clients: Client[] = [];

  // clients 客户端
  public readonly news: NewsClient;

  constructor(config?: HUSTConfig) {
    this.cookieManager = new CookieManager();
    this.auth = new CASAuth(this.cookieManager);
    this.news = new NewsClient(this);

    if (config?.maxLoginRetries) {
      this.maxLoginRetries = config.maxLoginRetries;
    }

    if (config?.loginCheckInterval) {
      this.loginCheckIntervalTime = config.loginCheckInterval;
    }

    if (config?.clients) {
      this.clients = config.clients;
    }

    if (config?.phoneCodeCallback) {
      this.phoneCodeCallback = config.phoneCodeCallback;
    }

    if (config?.info) {
      this.loginInfo = { ...config.info };
      // 开始初始登录
      this.initialLogin();
    }
  }

  /**
   * 设置手机验证码回调函数
   */
  setPhoneCodeCallback(callback: PhoneCodeCallback) {
    this.phoneCodeCallback = callback;
  }

  /**
   * 登录
   */
  async login(info: LoginInfo): Promise<boolean> {
    if (!info) {
      throw new Error('Login info is required');
    }
    this.setLoginInfo(info);

    const maxRetries = this.maxLoginRetries;
    let loginRetryCount = 0;
    let loginSuccess = false;

    try {
      const isLoggedIn = await this.isLoggedIn();

      if (isLoggedIn) {
        return true;
      }

      if (this.isLoggingIn) {
        return false;
      }
      this.isLoggingIn = true;

      while (loginRetryCount < maxRetries && !loginSuccess) {
        try {
          loginSuccess = await this.auth.login(info, this.phoneCodeCallback);

          if (loginSuccess) {
            let loginClients = this.clients;
            if (loginClients.length === 0) {
              loginClients = Object.values(Client);
            }
            await Promise.all(
              loginClients.map((client) => this.loginClient(client)),
            );
            return true;
          }
        } catch (e) {
          console.error('Login error:', e);
        } finally {
          loginRetryCount++;
        }
      }
      return false;
    } finally {
      this.isLoggingIn = false;
      if (!this.loginCheckTimer) {
        this.startLoginCheck();
      }
    }
  }

  private async initialLogin(): Promise<boolean> {
    if (!this.loginInfo) {
      return false;
    }

    if (this.isInitialLogging) {
      return this.initialLoginPromise || false;
    }

    this.isInitialLogging = true;

    this.initialLoginPromise = (async () => {
      try {
        const loggedIn = await this.login(this.loginInfo!);
        // console.log('Initial login attempt result:', loggedIn);
        if (loggedIn) {
          return true;
        } else {
          return false;
        }
      } catch (e) {
        console.error('Error during initial login attempt:', e);
        return false;
      } finally {
        this.isInitialLogging = false;
      }
    })();

    // console.log('InitialLoginPromise set:', this.initialLoginPromise);

    return this.initialLoginPromise;
  }

  private async loginClient(client: Client): Promise<boolean> {
    switch (client) {
      case Client.news:
        return await this.auth.loginONE();
      default:
        throw new Error(`Client ${client} not supported`);
    }
  }

  /**
   * 检查登录状态
   */
  async isLoggedIn(): Promise<boolean> {
    return await this.auth.checkLoginStatus();
  }

  async handleRequest<T>(requestFn: () => Promise<T>): Promise<T> {
    let loginResult: boolean;

    if (!this.initialLoginPromise) {
      loginResult = await this.initialLogin();
    } else {
      loginResult = await this.initialLoginPromise;
    }

    if (!loginResult) {
      throw new Error('initial login failed at handleRequest');
    }

    try {
      return await requestFn();
    } catch (error) {
      if (isAuthError(error)) {
        const reLoginSuccess = await this.login(this.loginInfo!);
        if (reLoginSuccess) {
          return await requestFn();
        } else {
          console.error('Re-login failed');
          throw error;
        }
      } else {
        throw error;
      }
    }
  }

  setLoginInfo(info: LoginInfo) {
    this.loginInfo = { ...info };
    // TODO:也许需要立刻重新 login
  }

  setLoginClients(clients: Client[]) {
    this.clients = clients;
  }

  /**
   * 注销
   */
  // async logout(): Promise<boolean> {
  //   return await this.auth.logout();
  // }

  /**
   * 获取 CookieManager
   */
  getCookieManager(): CookieManager {
    return this.cookieManager;
  }

  async startLoginCheck(interval?: number) {
    if (this.loginCheckTimer) {
      clearInterval(this.loginCheckTimer);
    }

    const checkInterval = interval || this.loginCheckIntervalTime;

    this.loginCheckTimer = setInterval(async () => {
      try {
        await this.login(this.loginInfo!);
      } catch (e) {
        console.error('Login check error:', e);
      }
    }, checkInterval);
  }

  stopLoginCheck(): void {
    if (this.loginCheckTimer) {
      clearInterval(this.loginCheckTimer);
      this.loginCheckTimer = null;
    }
  }
}

const hust = new HUST({
  info: {
    studentId: process.env.HUST_SDK_STUDENT_ID!,
    password: process.env.HUST_SDK_PASSWORD!,
  },
});

const now = new Date();

// const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

console.log('Initializing HUST SDK...');
// await sleep(5000);
const res = await hust.news.getNewsList();
console.log('News List:', res);

console.log(`initialized after ${new Date().getTime() - now.getTime()}ms`);
