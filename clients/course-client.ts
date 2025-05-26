import type { AxiosInstance } from 'axios';
import axios from 'axios';
import { useCookie } from '@/utils/use-cookie';
import type HUST from '..';
import { getPhysicsCourseGrades, getPhysicsCourseSchedule as getPhysicsCourseSchedule } from './course/physics';

export default class CourseClient {
  protected readonly axios: AxiosInstance;
  protected readonly hust: HUST;

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

  async getPhysicsCourseSchedule() {
    return await this.hust.handleRequest(() =>
      getPhysicsCourseSchedule(this.axios),
    );
  }

  async getPhysicsCourseGrades() {
    return await this.hust.handleRequest(() =>
      getPhysicsCourseGrades(this.axios),
    );
  }
}
