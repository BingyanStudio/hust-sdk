import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import type { RedirectOptions } from '@/types/utils';

export async function followRedirect(
  response: AxiosResponse,
  axios: AxiosInstance,
  options?: RedirectOptions,
) {
  let finalResponse = response;
  let location = response.headers.location;
  const MAX_REDIRECTS = options?.maxRedirects ?? 6;
  let redirectCount = 0;

  while (
    finalResponse.status === 302 &&
    location &&
    redirectCount < MAX_REDIRECTS
  ) {
    redirectCount++;
    // 302 状态码会把请求方法统一修改成 GET，模拟浏览器
    const config: AxiosRequestConfig = {
      url: location,
      method: 'GET',
    };

    if (options?.headers) {
      if (Object.keys(options.headers).every((key) => isNaN(Number(key)))) {
        config.headers = {
          ...config.headers,
          ...options.headers,
        };
      } else {
        const specificHeaders = (
          options.headers as Record<number, Record<string, string>>
        )[redirectCount];
        if (specificHeaders) {
          config.headers = {
            ...config.headers,
            ...specificHeaders,
          };
        }
      }
    }

    finalResponse = await axios(config);
    location = finalResponse.headers.location;
  }

  return finalResponse;
}

export function isAuthError(error: any): boolean {
  if (error && error.response) {
    return (
      error.response === 302 &&
      error.response.headers.location.includes('login')
    );
  }
  return false;
}
