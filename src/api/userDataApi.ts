import request from '@/utils/http'

export const UserDataApi = {
  bindSysUserData: (data: object) => {
    return request({
      url: '/userData/bindSysUserData',
      method: 'post',
      data,
    })
  },

  againBindSysUserData: (data: object) => {
    return request({
      url: '/userData/againBindSysUserData',
      method: 'post',
      data,
    })
  },
}
