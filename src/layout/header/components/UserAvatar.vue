<script setup lang="ts">
import { useBaseApiListStore, useTabStore, useUserStore } from '@/store'
import { renderIcon } from '@/utils/common'
import avatar from '@/assets/images/userPic.jpg'

const userStore = useUserStore()
const useBaseApiStore = useBaseApiListStore()

const tabStore = useTabStore()
const options = [

  {
    label: '退出登录',
    key: 'logout',
    icon: renderIcon('mdi:exit-to-app', { size: 18 }),
  },
]

function handleSelect(key: string) {
  if (key === 'logout') {
    window.$dialog?.info({
      content: '确认退出？',
      title: '提示',
      positiveText: '确定',
      negativeText: '取消',
      onPositiveClick() {
        userStore.logout()
        useBaseApiStore.removeInfo()
        tabStore.removeAllTab([])
        window.$message?.success('已退出登录!')
      },
    })
  }
}
</script>

<template>
  <n-dropdown :options="options" @select="handleSelect">
    <div flex items-center cursor-pointer>
      <!-- <img :src="userStore.avatar" mr10 w-35 h-35 rounded-full> -->
      <img :src="avatar" mr10 w-35 h-35 rounded-full>
      <span hidden sm:block> {{ userStore.linkmanName }}</span>
    </div>
  </n-dropdown>
</template>
