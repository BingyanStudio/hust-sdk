import CookieManager from '@/auth/cookie-manager';
import CASAuth from '@/auth/cas';
import type { LoginInfo, PhoneCodeCallback } from '@/types/auth';
import NewsClient from '@/clients/news-client';
import { Client, type HUSTConfig } from '@/types/hust';
import { isAuthError } from './utils/request';
import { getPhoneCodeFromConsole } from './utils/console-input';
import { AxiosError } from 'axios';
import CourseClient from './clients/course-client';

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
  private loginCheckIntervalTime: number = 1000 * 60 * 10; // 默认 10 分钟
  private clients: Client[] = Object.values(Client); // 默认登录所有客户端

  // clients 客户端
  public readonly news: NewsClient;
  public readonly course: CourseClient;

  constructor(config?: HUSTConfig) {
    this.cookieManager = new CookieManager();
    this.auth = new CASAuth(this.cookieManager);
    this.news = new NewsClient(this);
    this.course = new CourseClient(this);

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
   * @param info 登录信息
   * @param check 是否检查登录状态，默认为 true \
   * 如果上下文中已经确认未登录，则可以设置为 false 来跳过检查
   */
  async login(info: LoginInfo, check = true): Promise<boolean> {
    if (!info) {
      throw new Error('Login info is required');
    }
    this.setLoginInfo(info);

    const maxRetries = this.maxLoginRetries;
    let loginRetryCount = 0;
    let loginSuccess = false;

    // 直接封装执行登录的操作，为了可以跳过检查
    const doLogin = async () => {
      while (loginRetryCount < maxRetries && !loginSuccess) {
        try {
          loginSuccess = await this.auth.login(info, this.phoneCodeCallback);

          if (loginSuccess) {
            let loginClients = this.clients;
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
    };

    try {
      // 如果正在登录中，直接返回 false
      if (this.isLoggingIn) {
        return false;
      }
      this.isLoggingIn = true;

      if (check) {
        const isLoggedIn = await this.isLoggedIn();

        if (isLoggedIn) {
          return true;
        }
      }

      return await doLogin();
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
      case Client.course:
        return (
          await Promise.all([
            this.auth.loginPhysics(),
            this.auth.loginHUBM(),
            this.auth.loginHUBS(),
          ])
        ).every((item) => item);
      default:
        throw new Error(`Client ${client} not supported`);
    }
  }

  /**
   * 检查特定客户端的登录状态 \
   * 如果一个 client 涉及多个域名，则需要使用 Promise.all 来并行检查所有域名的登录状态
   *
   * @private
   * @async
   * @param {Client} client 客户端
   * @returns {Promise<boolean>} 如果已登录返回 true，否则返回 false
   */
  private async checkClient(client: Client): Promise<boolean> {
    switch (client) {
      case Client.news:
        return await this.auth.checkONE();
      default:
        throw new Error(`Client ${client} not supported`);
    }
  }

  /**
   * 检查所有服务的登录状态
   */
  async isLoggedIn(): Promise<boolean> {
    const isAuthLogin = await this.auth.checkLoginStatus();

    if (!isAuthLogin) {
      return false;
    }

    // 检查所有客户端的登录状态
    const clientCheckPromises = this.clients.map((client) =>
      this.checkClient(client),
    );
    const clientResults = await Promise.all(clientCheckPromises);

    return clientResults.every((result) => result);
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
      // 只处理 AxiosError，其他错误应该在 requestFn 内部处理
      if (error instanceof AxiosError) {
        if (isAuthError(error)) {
          const reLoginSuccess = await this.login(this.loginInfo!, false);
          if (reLoginSuccess) {
            return await requestFn();
          } else {
            console.error('Re-login failed');
            throw error;
          }
        } else {
          throw error;
        }
      } else {
        console.error(
          '[HUST SDK] Non-AxiosError caught in handleRequest. ' +
            'Please handle this error type in your requestFn. ' +
            'handleRequest only processes AxiosError automatically.',
          error,
        );
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
  loginCheckInterval: 600000, // 10 分钟检查一次登录状态
});

const now = new Date();

// const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

console.log('Initializing HUST SDK...');
// await sleep(1000 * 2);
const res = await hust.news.getNewsList();
console.log('News List:', res);

const res2 = await hust.course.getNormalCourseGrades('20241', { all: true });
console.log('Course Grades:', res2);

console.log(`initialized after ${new Date().getTime() - now.getTime()}ms`);
