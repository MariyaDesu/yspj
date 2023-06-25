import request from '@/utils/http'

export const LoginApi = {
  login: (data: object) => {
    return request({
      url: '/user/login',
      method: 'post',
      data,
    })
  },
}
