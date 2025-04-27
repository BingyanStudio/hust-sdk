import CookieManager from '@/auth/cookie-manager';
import type { LoginInfo, LoginTickets, RSAResponse } from '@/types/auth';
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

  async getLoginTickets(): Promise<LoginTickets | null> {
    const isLogin = await this.checkLoginStatus();
    if (isLogin) {
      return null;
    }

    const response = await this.axios.get(`${CASAuth.CAS_URL}/login`);
    const html = response.data;

    const ltMatch = html.match(
      /<input type="hidden" id="lt" name="lt" value="(.*?)" \/>/,
    );
    const execMatch = html.match(
      /<input type="hidden" name="execution" value="(.*?)" \/>/,
    );

    if (!ltMatch || !execMatch) {
      return null;
    }

    return {
      lt: ltMatch[1],
      execution: execMatch[1],
    };
  }

  /**
   * 统一认证登录
   *
   * @async
   * @param {LoginInfo} info 登录信息，学号和密码
   * @returns {boolean} 登录成功返回 true，否则返回 false
   */
  async login(info: LoginInfo) {
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
    formData.append('phoneCode', 'null');
    formData.append('lt', tickets.lt);
    formData.append('execution', tickets.execution);
    formData.append('_eventId', 'submit');

    // console.log('formData', formData.toString());
    const loginResponse = await this.axios.post(
      `${CASAuth.CAS_URL}/login`,
      formData,
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      },
    );

    console.log('loginResponse', loginResponse.status);
    // if (loginResponse.status === 302 && loginResponse.headers.location) {
    //   console.log(
    //     'loginResponse.headers.location',
    //     loginResponse.headers.location,
    //   );
    // }

    return (
      loginResponse.status === 302 &&
      loginResponse.headers.location.includes(CASAuth.CAS_REDIRECT_DOMAIN)
    );
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

  async loginPETYXY(info: LoginInfo) {
    const url = 'https://petyxy.hust.edu.cn/pft/app/resultList';
    const isLogin = await this.checkLoginStatus();

    if (!isLogin) {
      await this.login(info);
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

  async loginHUBS(info: LoginInfo) {
    const url = 'https://hubs.hust.edu.cn';
    const isLogin = await this.checkLoginStatus();

    if (!isLogin) {
      await this.login(info);
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

        return response.status === 200;
      }
    } catch (e) {
      return false;
    }
  }

  async loginONE(info: LoginInfo) {
    const url = 'https://one.hust.edu.cn/dcp/';
    const isLogin = await this.checkLoginStatus();

    if (!isLogin) {
      await this.login(info);
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

        return response.status === 200;
      }
    } catch (e) {
      return false;
    }
  }
}

const cookieManager = new CookieManager();
const casAuth = new CASAuth(cookieManager);
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

await casAuth.loginONE({
  studentId: process.env.HUST_SDK_STUDENT_ID!,
  password: process.env.HUST_SDK_PASSWORD!,
});
await casAuth.testONE();
cookieManager.watchCookies();
