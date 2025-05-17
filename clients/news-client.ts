import type { AxiosInstance } from 'axios';
import axios from 'axios';
import { useCookie } from '@/utils/use-cookie';
import type HUST from '..';

export default class NewsClient {
  protected readonly axios: AxiosInstance;
  private readonly hust: HUST;

  constructor(hust: HUST) {
    this.hust = hust;
    this.axios = axios.create({
      timeout: 30000,
      maxRedirects: 0,
      validateStatus: (status) => status < 400,
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36',
      },
    });
    useCookie(this.axios, this.hust.getCookieManager());
  }

  async getNewsList() {
    const requestFunc = async () => {
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
        return response.data;
      } catch (e) {
        console.error('testONE error', e);
        return null;
      }
    };
    return await this.hust.handleRequest(requestFunc);
  }
}
