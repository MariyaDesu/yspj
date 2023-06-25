import { defineStore } from 'pinia'
import { filterAsyncRoutes } from './helpers'
import { basicRoutes } from '@/router/routes'
import type { RoutesType } from '~/types/router'

export const usePermissionStore = defineStore('permission', {
  state() {
    return {
      accessRoutes: <RoutesType> [],
    }
  },
  getters: {
    routes(): RoutesType {
      return basicRoutes.concat(this.accessRoutes)
    },
    menus(): RoutesType {
      return this.routes.filter(route => route.name && !route.isHidden)
    },
  },
  actions: {
    generateRoutes(menuList: RoutesType): RoutesType {
      const accessRoutes = filterAsyncRoutes(menuList)
      this.accessRoutes = accessRoutes
      return accessRoutes
    },
  },
})
