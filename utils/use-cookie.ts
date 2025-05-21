import type CookieManager from '@/auth/cookie-manager';
import type { AxiosInstance } from 'axios';

/**
 * 给 axios 实例的拦截器添加 cookie 处理，在本项目中每一个 Client 都需要在初始化的时候使用这个 hook。
 * @param axios axios 实例
 * @param cookieManager CookieManager 实例
 */
export const useCookie = (
  axios: AxiosInstance,
  cookieManager: CookieManager,
) => {
  // 响应拦截，存入 set-cookie
  axios.interceptors.response.use(async (response) => {
    console.log('Response URL:', response.config.url);
    console.log('Response Status:', response.status);
    const setCookieHeaders = response.headers['set-cookie'];
    const url = response.config.url;
    if (setCookieHeaders && url) {
      await cookieManager.setCookies(url, setCookieHeaders);
    }
    return response;
  });

  // 请求拦截，添加 cookie
  axios.interceptors.request.use(async (config) => {
    const url = config.url;
    if (url) {
      const cookieHeader = await cookieManager.getCookieHeader(url);
      if (cookieHeader) {
        config.headers['Cookie'] = cookieHeader;
      }
    }
    return config;
  });
};
