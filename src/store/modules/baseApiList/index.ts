import { defineStore } from 'pinia'
// import type { TreeOption } from 'naive-ui'
import { baseApi } from '@/api/baseApi'
import { formatSelectDrop } from '@/utils/common'
export const useBaseApiListStore = defineStore('baseApiList', {
  // 开启数据缓存
  persist: {
    enabled: true,
  },
  state() {
    return {
      budAccountInfo: [],
      accountSubInfo: [],
      assetInfo: [],
      assetUserInfo: [],
      branchInfo: [],
      branchUserInfo: [],
      budProgrammeInfo: [],
      timeInfo: {},

    }
  },

  actions: {
    // 预算科目
    async getBudAccountantSubjectList() {
      try {
        const res = await baseApi.getBudgetEntryMenuList()
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
    // 会计科目
    async getAccountSubSubjectList() {
      try {
        const res = await baseApi.getBudAccountantSubjectList()
        if (res.code === 200) {
          this.accountSubInfo = res.data
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
        const res = await baseApi.getAssetList()
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
    // 管理结构
    async getBranchOptionsList() {
      try {
        const res = await baseApi.fetchBranch()
        if (res.code === 200) {
          this.branchInfo = res.data
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
    // 日期
    async  selectCanUpdateTime() {
      const res = await baseApi.selectCanUpdateTime()
      if (res.code === 200)
        this.timeInfo = res.data
    },

    // 有权限的产权结构
    async getUserAssetSelect() {
      try {
        const res = await baseApi.getUserAssetSelect()
        if (res.code === 200) {
          formatSelectDrop(res.data)
          this.assetUserInfo = res.data
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
    // 有权限的管理结构
    async getUserBranchSelect() {
      try {
        const res = await baseApi.getUserBranchSelect()
        if (res.code === 200) {
          formatSelectDrop(res.data)
          this.branchUserInfo = res.data
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
    // 预算方案
    async getselectCurrent() {
      try {
        const res = await baseApi.getselectCurrent()
        if (res.code === 200) {
          this.budProgrammeInfo = res.data
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

    removeInfo() {
      this.budAccountInfo = []
      this.accountSubInfo = []
      this.assetInfo = []
      this.assetUserInfo = []
      this.branchInfo = []
      this.branchUserInfo = []
      this.budProgrammeInfo = []
      this.timeInfo = {}
    },

  },
})
