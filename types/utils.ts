/**
 * 重定向选项
 *
 * @path @/utils/request.ts followRedirect
 * @export
 * @interface RedirectOptions
 * @typedef {RedirectOptions}
 */
export interface RedirectOptions {
  maxRedirects?: number; // 最大重定向次数
  /**
   * 请求头配置
   * - 如果是对象: 所有重定向请求都使用相同的请求头
   * - 如果是以重定向次数为键的对象: 为特定次数的重定向添加请求头，从 1 开始
   */
  headers?: Record<string, string> | Record<number, Record<string, string>>;
}
