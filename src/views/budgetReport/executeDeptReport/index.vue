<script setup lang="ts">
import searchHeader from './search.vue'
import tableList from './tableList.vue'

import { showBtnLength } from '@/utils/common'
const router = useRouter()
const { currentRoute } = router
const currentRouteMetaList = reactive({
  buttons: currentRoute.value.meta.buttons as string[],
})

const arrTitleMeta = ['查找']
const metaTitleLength = showBtnLength(arrTitleMeta, currentRouteMetaList.buttons)
</script>

<template>
  <n-space vertical size="large" bg-white h-full p-24>
    <!-- 头部 -->
    <n-layout-header>
      <searchHeader />
    </n-layout-header>
    <!-- 内容 -->
    <n-layout>
      <tableList :meta-title-length="metaTitleLength" />
    </n-layout>
  </n-space>
</template>

<style scoped>

</style>
