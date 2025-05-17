import type { LoginInfo } from './auth';

export enum Client {
  news = 'news',
}

export interface HUSTConfig {
  info?: LoginInfo;
  maxLoginRetries?: number; // 最大登录重试次数
  loginCheckInterval?: number; // 登录检查间隔
  clients?: Client[]; // 需要登录的客户端，为空则登录所有客户端
}
