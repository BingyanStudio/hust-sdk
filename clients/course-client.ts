import type { AxiosInstance } from 'axios';
import axios from 'axios';
import { useCookie } from '@/utils/use-cookie';
import type HUST from '..';
import {
  getPhysicsCourseGrades,
  getPhysicsCourseSchedule as getPhysicsCourseSchedule,
} from './course/physics';
import {
  getExaminationArrangements,
  getNormalCourseGrades,
  getNormalCourseSchedule,
} from './course/course';
import { ExaminationType } from '@/types/clients/course/course';

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

  async getNormalCourseSchedule(semesterId: string) {
    return await this.hust.handleRequest(() =>
      getNormalCourseSchedule(this.axios, semesterId),
    );
  }

  async getNormalCourseGrades(
    semesterId: string,
    {
      all,
      pageNumber,
      pageSize,
    }: {
      all?: boolean;
      pageNumber?: number;
      pageSize?: number;
    } = {
      all: false,
      pageNumber: 1,
      pageSize: 20,
    },
  ) {
    if (all) {
      pageNumber = 1;
      pageSize = 100;
    }
    return await this.hust.handleRequest(() =>
      getNormalCourseGrades(this.axios, semesterId, pageNumber, pageSize),
    );
  }

  async getExaminationArrangements(
    semesterId: string,
    {
      pageIndex,
      pageSize,
      keyword,
      type,
    }: {
      pageIndex: number;
      pageSize: number;
      keyword: string;
      type: ExaminationType;
    } = {
      pageIndex: 1,
      pageSize: 100,
      keyword: '',
      type: ExaminationType.NORMAL,
    },
  ) {
    return await this.hust.handleRequest(() =>
      getExaminationArrangements(this.axios, semesterId, {
        pageIndex,
        pageSize,
        keyword,
        type,
      }),
    );
  }
}
