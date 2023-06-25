import axios from 'axios'
import { reqReject, reqResolve, resReject, resResolve } from './interceptors'

// let str = window.location.href
// const reg = /(\w+):\/\/([^/:]+)(:\d*)?/
// str = str.match(reg)![0]
// str = `${str}/api`

export function createAxios(options = {}) {
  const defaultOptions = {
    // baseURL: str,
    // baseURL: 'http://192.168.8.22:6001', // 年军
    // baseURL: 'http://192.168.8.24:6001', // 年军
    // baseURL: 'http://192.168.3.192:6001', // jar包
    baseURL: 'http://192.168.8.18:6001', // 高立
    // baseURL: 'http://192.168.3.102:8001', // 高立
    // baseURL: 'http://ys.leazy.cn:6001', //
    // baseURL: 'http://120.234.192.56:20280/api', //
    // baseURL: 'http://192.168.8.199:6001',
    // baseURL: import.meta.env.VITE_BASE_API,
    timeout: 12000,
    // timeout: 1000000,
  }
  const service = axios.create({
    ...defaultOptions,
    ...options,
  })
  service.interceptors.request.use(reqResolve, reqReject)
  service.interceptors.response.use(resResolve, resReject)
  return service
}

export default createAxios()

