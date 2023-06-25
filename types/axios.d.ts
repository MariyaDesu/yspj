import type { AxiosRequestConfig } from 'axios'
declare module 'axios' {
  interface AxiosInstance {
    (config: AxiosRequestConfig): Promise<any>
  }
}
interface RequestConfig extends AxiosRequestConfig {
  /** 接口是否需要token */
  noNeedToken?: boolean
  /** 接口是否需要错误提醒 */
  noNeedTip?: boolean
  code?: number
}

interface ErrorResolveResponse {
  code?: number | string
  message: string
  data?: any
}

