import CookieManager from '@/auth/cookie-manager';
import type { LoginInfo, LoginTickets, PhoneCodeCallback, RSAResponse } from '@/types/auth';
import { recognizeGifCaptcha } from '@/utils/dynamic-code';
import { followRedirect } from '@/utils/request';
import { rsaEncrypt } from '@/utils/rsa';
import { useCookie } from '@/utils/use-cookie';
import type { AxiosInstance, AxiosResponse } from 'axios';
import axios from 'axios';

export default class CASAuth {
  private readonly axios: AxiosInstance;
  private readonly cookieManager: CookieManager;
  private static CAS_URL = 'https://pass.hust.edu.cn/cas';
  private static CAS_REDIRECT_DOMAIN = 'one.hust.edu.cn';

  constructor(cookieManager: CookieManager) {
    this.cookieManager = cookieManager;
    this.axios = axios.create({
      timeout: 30000,
      maxRedirects: 0,
      validateStatus: (status) => status < 400,
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36',
      },
    });
    useCookie(this.axios, this.cookieManager);
  }

  /**
   * 检查登录状态
   * @returns {boolean} 已登录为 true，否则为 false
   */
  async checkLoginStatus() {
    try {
      const response = await this.axios.get(`${CASAuth.CAS_URL}/login`);

      return (
        response.status === 302 &&
        response.headers.location.includes(CASAuth.CAS_REDIRECT_DOMAIN)
      );
    } catch (e) {
      return false;
    }
  }

  /**
   * 从登录响应中解析新的票据信息
   * @param {string} html 登录响应的HTML内容
   * @returns {LoginTickets | null} 解析出的票据信息，如果解析失败返回 null
   */
  private parseTicketsFromHTML(html: string): LoginTickets | null {
    const ltMatch = html.match(
      /<input type="hidden" id="lt" name="lt" value="(.*?)" \/>/,
    );
    const execMatch = html.match(
      /<input type="hidden" name="execution" value="(.*?)" \/>/,
    );

    if (!ltMatch?.[1] || !execMatch?.[1]) {
      return null;
    }

    return {
      lt: ltMatch[1],
      execution: execMatch[1],
    };
  }

  async getLoginTickets(): Promise<LoginTickets | null> {
    const isLogin = await this.checkLoginStatus();
    if (isLogin) {
      return null;
    }

    const response = await this.axios.get(`${CASAuth.CAS_URL}/login`);
    const html = response.data;

    const tickets = this.parseTicketsFromHTML(html);
    return tickets;
  }

  /**
   * 判断是否需要手机验证码
   * @param {string} html 登录响应的HTML内容
   * @returns {boolean} 需要手机验证码返回 true，否则返回 false
   */
  private isPhoneCodeRequired(html: string): boolean {
    return (
      html.includes('id="phoneCode"') &&
      html.includes('class="login_box_input dtm-pic"')
    );
  }

  /**
   * 统一认证登录
   *
   * @async
   * @param {LoginInfo} info 登录信息，学号和密码
   * @param {PhoneCodeCallback} phoneCodeCallback 获取手机验证码的回调函数，当需要手机验证码时会调用
   * @returns {Promise<boolean>} 登录成功返回 true，否则返回 false
   */
  async login(
    info: LoginInfo,
    phoneCodeCallback?: PhoneCodeCallback,
  ): Promise<boolean> {
    const tickets = await this.getLoginTickets();

    if (!tickets) {
      return await this.checkLoginStatus();
    }

    const rsaResponse: AxiosResponse<RSAResponse> = await this.axios.post(
      `${CASAuth.CAS_URL}/rsa`,
    );
    const publicKey = rsaResponse.data.publicKey;

    const encryptedStudentId = Buffer.from(
      rsaEncrypt(publicKey, Buffer.from(info.studentId)),
    ).toBase64();

    const encryptedPassword = Buffer.from(
      rsaEncrypt(publicKey, Buffer.from(info.password)),
    ).toBase64();

    const code = await recognizeGifCaptcha(`${CASAuth.CAS_URL}/code`);

    const formData = new URLSearchParams();
    formData.append('rsa', 'null');
    formData.append('ul', encryptedStudentId);
    formData.append('pl', encryptedPassword);
    formData.append('code', code || '');
    formData.append('phoneCode', 'null'); // 初始不提供手机验证码
    formData.append('lt', tickets.lt);
    formData.append('execution', tickets.execution);
    formData.append('_eventId', 'submit');

    const loginResponse = await this.axios.post(
      `${CASAuth.CAS_URL}/login`,
      formData,
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      },
    );

    // 检查是否登录成功
    if (
      loginResponse.status === 302 &&
      loginResponse.headers.location.includes(CASAuth.CAS_REDIRECT_DOMAIN)
    ) {
      return true;
    }

    // 检查是否需要手机验证码
    if (
      loginResponse.status === 200 &&
      this.isPhoneCodeRequired(loginResponse.data)
    ) {
      if (!phoneCodeCallback) {
        console.error(
          'Phone verification code is required but no callback was provided.',
        );
        console.error(
          'Please provide a phoneCodeCallback in the HUST constructor config.',
        );
        return false;
      }

      console.log('Phone verification code required for login.');

      // 解析新的ticket信息
      const newTickets = this.parseTicketsFromHTML(loginResponse.data);
      if (!newTickets) {
        console.error('Failed to parse new tickets from phone code page');
        return false;
      }

      // 获取用户输入的验证码
      const phoneCode = await phoneCodeCallback();

      if (!phoneCode || phoneCode.trim().length === 0) {
        console.error('Empty phone verification code provided');
        return false;
      }

      // 创建带有手机验证码的表单数据
      const phoneCodeFormData = new URLSearchParams();
      phoneCodeFormData.append('rsa', 'null');
      phoneCodeFormData.append('ul', encryptedStudentId);
      phoneCodeFormData.append('pl', encryptedPassword);
      phoneCodeFormData.append('code', code || '');
      phoneCodeFormData.append('phoneCode', phoneCode);
      phoneCodeFormData.append('lt', newTickets.lt);
      phoneCodeFormData.append('execution', newTickets.execution);
      phoneCodeFormData.append('_eventId', 'submit');

      // 重新提交登录请求，这次带上验证码
      const phoneCodeResponse = await this.axios.post(
        `${CASAuth.CAS_URL}/login`,
        phoneCodeFormData,
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        },
      );

      return (
        phoneCodeResponse.status === 302 &&
        phoneCodeResponse.headers.location.includes(CASAuth.CAS_REDIRECT_DOMAIN)
      );
    }

    return false;
  }

  async testHUBS() {
    const apiUrl = 'https://hubs.hust.edu.cn/schedule/getCurrentXq';

    try {
      const response = await this.axios.get(apiUrl);
      console.log('testAuth success with status', response.status);
      console.log('testAuth response', response.data);
    } catch (e) {
      console.log('testAuth error', e);
    }
  }

  async testPETYXY() {
    const url = 'http://petyxy.hust.edu.cn/pft/app/resultList?periodId=20242';

    try {
      let response = await this.axios.get(url);

      console.log('testPE success with status', response.status);
      console.log('testPE response', response.data);
      return response.status === 200;
    } catch (e) {
      return false;
    }
  }

  async testONE() {
    const url = 'https://one.hust.edu.cn/dcp/pim/pim.action';

    try {
      const response = await this.axios.post(
        url,
        {
          map: {
            method: 'getAllPimList',
            params: {
              javaClass: 'java.util.ArrayList',
              list: ['', '', '', '', '', ''],
            },
            pm: {
              javaClass: 'com.neusoft.education.edp.client.PageManager',
              pageSize: 10,
              pageNo: '1',
              totalCount: -1,
              order: null,
              filters: {
                javaClass: 'com.neusoft.education.edp.client.QueryFilter',
                parameters: {
                  javaClass: 'java.util.HashMap',
                  map: {},
                },
              },
              pageSumcols: null,
              pageSums: null,
              sumcols: null,
              isNewSum: null,
              sums: null,
              resPojoName: '',
            },
          },
          javaClass: 'java.util.HashMap',
        },
        {
          headers: {
            Clienttype: 'json',
            Render: 'json',
          },
        },
      );
      console.log('testONE success with status', response.status);
      console.log('testONE response', response.data);
      return response.status === 200;
    } catch (e) {
      return false;
    }
  }

  async loginPETYXY() {
    const url = 'https://petyxy.hust.edu.cn/pft/app/resultList';
    const isLogin = await this.checkLoginStatus();

    if (!isLogin) {
      return false;
    }

    try {
      let response = await this.axios.get(url);
      response = await followRedirect(response, this.axios);

      // service 如果使用 https 会得到 500 状态码，暂不清楚原因，这里只能使用 http，后续请求也必须是 http。
      response = await this.axios.get(
        'https://pass.hust.edu.cn/cas/login?service=http://petyxy.hust.edu.cn/ggtypt/dologin',
      );

      response = await followRedirect(response, this.axios);
      return response.status === 200;
    } catch (e) {
      return false;
    }
  }

  async loginHUBS() {
    const url = 'https://hubs.hust.edu.cn';
    const isLogin = await this.checkLoginStatus();

    if (!isLogin) {
      return false;
    }

    try {
      let response = await this.axios.get(url);

      if (
        response.status === 302 &&
        response.headers.location.includes('login')
      ) {
        response = await this.axios.get(
          `${CASAuth.CAS_URL}/login?service=${encodeURIComponent('https://hubs.hust.edu.cn/cas/login')}`,
        );

        response = await followRedirect(response, this.axios);
      }
      return response.status === 200;
    } catch (e) {
      return false;
    }
  }

  async loginONE() {
    const url = 'https://one.hust.edu.cn/dcp/';
    const isLogin = await this.checkLoginStatus();

    if (!isLogin) {
      return false;
    }

    try {
      let response = await this.axios.get(url);

      if (
        response.status === 302 &&
        response.headers.location.includes('login')
      ) {
        response = await this.axios.get(
          `${CASAuth.CAS_URL}/login?service=${encodeURIComponent('https://one.hust.edu.cn/dcp/index.jsp')}`,
        );

        response = await followRedirect(response, this.axios);
      }
      return response.status === 200;
    } catch (e) {
      return false;
    }
  }
}

// const cookieManager = new CookieManager();
// const casAuth = new CASAuth(cookieManager);
// console.log(
//   await casAuth.login({
//     studentId: process.env.HUST_SDK_STUDENT_ID!,
//     password: process.env.HUST_SDK_PASSWORD!,
//   }),
// );

// await casAuth.loginPETYXY({
//   studentId: process.env.HUST_SDK_STUDENT_ID!,
//   password: process.env.HUST_SDK_PASSWORD!,
// });
// await casAuth.testPETYXY();

// await casAuth.loginHUBS({
//   studentId: process.env.HUST_SDK_STUDENT_ID!,
//   password: process.env.HUST_SDK_PASSWORD!,
// });
// await casAuth.testHUBS();

// await casAuth.loginONE({
//   studentId: process.env.HUST_SDK_STUDENT_ID!,
//   password: process.env.HUST_SDK_PASSWORD!,
// });
// await casAuth.testONE();
// cookieManager.watchCookies();
