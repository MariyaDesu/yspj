import type { Router } from 'vue-router'
import type { RouteType } from '~/types/router'
import { NOT_FOUND_ROUTE } from '@/router/routes'
import { getToken, refreshAccessToken, removeToken } from '@/utils/auth/token'
import { toLogin } from '@/utils/auth/router'
import { isNullOrWhitespace } from '@/utils/common'
import { usePermissionStore, useUserStore } from '@/store'

const WHITE_LIST = ['/login']
const Layout = () => import('@/layout/index.vue')
export function createPermissionGuard(router: Router) {
  const userStore: any = useUserStore()
  const permissionStore = usePermissionStore()
  router.beforeEach(async (to) => {
    const token = getToken()

    /** 没有token的情况 */
    if (isNullOrWhitespace(token)) {
      if (WHITE_LIST.includes(to.path))
        return true
      return { path: 'login', query: { ...to.query, redirect: to.path } }
    }

    /** 有token的情况 */
    if (to.path === '/login')
      return { path: '/', replace: true }
    // 已经拿到用户信息
    if (!isNullOrWhitespace(userStore.userName)) {
      refreshAccessToken()
      return true
    }

    await userStore.getUserInfo().then((res) => {
      if (res.menuList.length === 0) {
        window.$notification?.error({ title: '用户没有权限！', duration: 2500 })
        userStore.logout()
      }
    }).catch((error) => {
      removeToken()
      toLogin()
      window.$message?.error(error.message || '获取用户信息失败！')
    })

    const modules = import.meta.glob('@/views/**/**/index.vue')

    const getData = (obj) => {
      obj.children.forEach((item) => {
        const mt = item.component
        item.component = modules[`/src/views${mt}/index.vue`]
        getData(item)
      })
    }

    userStore.menuList.forEach((item) => {
      item.component = Layout
      getData(item)
    })
    if (userStore.menuList[0].menuName === 'workbench')
      userStore.menuList.splice(0, 1)
    const accessRoutes = permissionStore.generateRoutes(userStore.menuList)
    accessRoutes.forEach((route: RouteType) => {
      !router.hasRoute(route.name) && router.addRoute(route)
    })

    router.addRoute(NOT_FOUND_ROUTE)
    return { ...to, replace: true }
  })
}
