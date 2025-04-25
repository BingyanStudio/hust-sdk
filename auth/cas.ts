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

      return response.status === 302;
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

    return loginResponse.status === 302;
  }

  async testAuth() {
    // const url = 'https://petyxy.hust.edu.cn/pft/app/resultList?periodId=20242';
    // const url = 'http://pecg.hust.edu.cn/cggl/appv2/personal_center';
    // const url = 'http://hard-working.hust.edu.cn';
    const website = 'https://hubs.hust.edu.cn';
    const apiUrl = 'https://hubs.hust.edu.cn/schedule/getCurrentXq';

    try {
      let response = await this.axios.get(website);

      if (
        response.status === 302 &&
        response.headers.location.includes('login')
      ) {
        // response = await this.axios.get(
        //   `${CASAuth.CAS_URL}/login?service=${encodeURIComponent('http://petyxy.hust.edu.cn/ggtypt/dologin')}`,
        // );
        response = await this.axios.get(
          `${CASAuth.CAS_URL}/login?service=${encodeURIComponent('https://hubs.hust.edu.cn/cas/login')}`,
        );

        const options = {
          headers: {
            // Accept:
            //   'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
            // 'Accept-Encoding': 'gzip, deflate, br, zstd',
            // 'Accept-Language': 'zh-CN,zh;q=0.9',
            // 'Cache-Control': 'max-age=0',
            // Priority: 'u=0, i',
            // 'Upgrade-Insecure-Requests': '1',
            // 'Sec-Ch-Ua':
            //   '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            // 'Sec-Ch-Ua-Mobile': '?0',
            // 'Sec-Ch-Ua-Platform': '"macOS"',
            // 'Sec-Fetch-Dest': 'document',
            // 'Sec-Fetch-Mode': 'navigate',
            // 'Sec-Fetch-Site': 'cross-site',
            // 'Sec-Fetch-User': '?1',
            // Connection: null,
          },
        };
        response = await followRedirect(response, this.axios, options);
        response = await this.axios.get(apiUrl);
      }
      console.log('testAuth success with status', response.status);
      console.log('testAuth response', response.data);
    } catch (e) {
      console.log('testAuth error', e);
    }
  }
}

const cookieManager = new CookieManager();
const casAuth = new CASAuth(cookieManager);
// casAuth.getLoginTickets();
console.log(
  await casAuth.login({
    studentId: process.env.HUST_SDK_STUDENT_ID!,
    password: process.env.HUST_SDK_PASSWORD!,
  }),
);

await casAuth.testAuth();
cookieManager.watchCookies();
