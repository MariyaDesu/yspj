<script setup lang="ts">
import SideBar from './sidebar/index.vue'
import AppHeader from './header/index.vue'
import AppTab from './tab/index.vue'
import AppMain from './AppMain.vue'

import { useThemeStore } from '@/store'

const themeStore = useThemeStore()
</script>

<template>
  <n-layout has-sider wh-full>
    <n-layout-sider
      v-if="!themeStore.isMobile"
      bordered
      collapse-mode="width"
      :collapsed-width="themeStore.sider.collapsedWidth"
      :width="themeStore.sider.width"
      :native-scrollbar="false"
      :collapsed="themeStore.sider.collapsed"
    >
      <SideBar />
    </n-layout-sider>
    <n-drawer
      v-else
      :width="themeStore.sider.width"
      :auto-focus="false"
      :show="!themeStore.sider.collapsed"
      placement="left"
      display-directive="show"
      @mask-click="themeStore.setCollapsed(true)"
    >
      <SideBar />
    </n-drawer>

    <article flex-1 flex-col overflow-auto>
      <header
        bg-white px-15 border-b bc-eee flex items-center dark="bg-dark border-0"
        :style="`height: ${themeStore.header.height}px`"
      >
        <AppHeader />
      </header>
      <section v-if="themeStore.tab.visible" border-b bc-eee dark:border-0 hidden sm:block>
        <AppTab />
      </section>
      <section class="cus-scroll-y flex-1 p-15 overflow-auto" bg="#f5f6fb" dark="bg-[#101014]">
        <AppMain />
      </section>
    </article>
  </n-layout>
</template>

