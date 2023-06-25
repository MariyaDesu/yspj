import type { GlobalThemeOverrides } from 'naive-ui'
import { defineStore } from 'pinia'
import { getNaiveThemeOverrides, initThemeSettings } from './helpers'

type ThemeState = Theme.Setting

export const useThemeStore = defineStore('theme-store', {
  state: (): ThemeState => initThemeSettings(),
  getters: {
    naiveThemeOverrides(): GlobalThemeOverrides {
      return getNaiveThemeOverrides({ primary: this.primaryColor, ...this.otherColor })
    },
  },
  actions: {
    setIsMobile(isMobile: boolean) {
      this.isMobile = isMobile
    },
    /** 切换/关闭 折叠侧边栏 */
    toggleCollapsed() {
      this.sider.collapsed = !this.sider.collapsed
    },
    /** 设置 折叠侧边栏 */
    setCollapsed(collapsed: boolean) {
      this.sider.collapsed = collapsed
    },
    /** 设置主题色 */
    setPrimaryColor(color: string) {
      this.primaryColor = color
    },
  },
})
