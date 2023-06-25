import { defineStore } from 'pinia'
import { removeToken } from '@/utils/auth/token'
import { toLogin } from '@/utils/auth/router'
import api from '@/api/index'
interface UserInfo {
  userId?: string
  userName?: string
  linkmanName?: string
  linkmanMobile?: string
  menuList?: Array<any>
  featuresList?: Array<any>
  assets?: Array<any>
}

export const useUserStore = defineStore('user', {
  state() {
    return {
      userInfo: <UserInfo>{},

    }
  },
  getters: {
    userId(): string {
      return this.userInfo.userId || ''
    },
    userName(): string {
      return this.userInfo.userName || ''
    },
    linkmanName(): string {
      return this.userInfo.linkmanName || ''
    },
    linkmanMobile(): string {
      return this.userInfo.linkmanMobile || ''
    },
    menuList(): Array<string> {
      return this.userInfo.menuList || []
    },
    featuresList(): Array<string> {
      return this.userInfo.featuresList || []
    },
    assets(): Array<string> {
      return this.userInfo.assets || []
    },

  },

  actions: {
    async getUserInfo() {
      try {
        const res = await api.getUser()
        if (res.code === 200) {
          const { userId, userName, linkmanName, linkmanMobile, menuList, featuresList, assets } = res.data
          this.userInfo = { userId, userName, linkmanName, linkmanMobile, menuList, featuresList, assets }
          return Promise.resolve(res.data)
        }
        else {
          return Promise.reject(res)
        }
      }
      catch (error) {
        return Promise.reject(error)
      }
    },

    async logout() {
      removeToken()
      this.userInfo = {}
      toLogin()
    },
    setUserInfo(userInfo = {}) {
      this.userInfo = { ...this.userInfo, ...userInfo }
    },
  },
})
