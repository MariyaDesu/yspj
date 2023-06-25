import { defineStore } from 'pinia'
import type { TreeOption } from 'naive-ui'
import { baseApi } from '@/api/baseApi'
export const useBaseApiListStore = defineStore('baseApiList', {
  // 开启数据缓存
  persist: {
    enabled: true,
  },
  state() {
    return {
      budAccountInfo: {},
      assetInfo: {},
    }
  },
  getters: {
    budAccountList(): TreeOption {
      return this.budAccountInfo
    },
    assetOptions() {
      return this.assetInfo
    },
  },

  actions: {
    // 预算科目
    async getBudAccountantSubjectList() {
      try {
        const res = await baseApi.getBudgetEntryMenuList({})
        if (res.code === 200) {
          this.budAccountInfo = res.data
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
    // 产权结构
    async getAssetOptionsList() {
      try {
        const res = await baseApi.getAssetList({})
        if (res.code === 200) {
          this.assetInfo = res.data
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
  },
})
