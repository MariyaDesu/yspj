import type { RouteModule, RouteType, RoutesType } from '~/types/router'
const Layout = () => import('@/layout/index.vue')

export const basicRoutes: RoutesType = [
  {
    name: 'Dashboard',
    path: '/',
    component: Layout,
    redirect: '/workbench',
    meta: {
      order: 0,
      icon: 'mdi:home',
      role: ['admin'],
      requireAuth: true,
    },
    children: [
      {
        name: 'Workbench',
        path: 'workbench',
        component: () => import('@/views/workbench/index.vue'),
        meta: {
          title: '工作台',
          icon: 'mdi:home',
        },
      },
    ],
  },
  {
    name: '404',
    path: '/404',
    component: () => import('@/views/error-page/404.vue'),
    isHidden: true,
  },
  {
    name: 'Login',
    path: '/login',
    component: () => import('@/views/login/index.vue'),
    isHidden: true,
    meta: {
      title: '登录页',
    },
  },
]

export const NOT_FOUND_ROUTE: RouteType = {
  name: 'NotFound',
  path: '/:pathMatch(.*)*',
  redirect: '/404',
  isHidden: true,
}

const modules = import.meta.glob('@/views/**/route.ts', { eager: true }) as RouteModule

const asyncRoutes: RoutesType = []
Object.keys(modules).forEach((key) => {
  asyncRoutes.push(modules[key].default)
})
export { asyncRoutes }
