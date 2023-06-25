<script setup lang="ts">
import searchHeader from './search.vue'
import tableList from './tableList.vue'
import edit from './edit.vue'
import editTable from './editTable.vue'

import { showBtnLength } from '@/utils/common'
const router = useRouter()
const { currentRoute } = router
const currentRouteMetaList = reactive({
  buttons: currentRoute.value.meta.buttons as string[],
})

const arrMeta = ['编辑审批角色', '编辑', '删除']
const metaLength = showBtnLength(arrMeta, currentRouteMetaList.buttons)
const arrTitleMeta = ['导出', '新增', '查找', '批量删除']
const metaTitleLength = showBtnLength(arrTitleMeta, currentRouteMetaList.buttons)

const instance = getCurrentInstance()
onUnmounted(() => {
  instance?.proxy?.$Bus.all.clear()
})
</script>

<template>
  <n-space vertical size="large" bg-white h-full p-24>
    <!-- 头部 -->
    <n-layout-header flex>
      <searchHeader :buttons="currentRouteMetaList.buttons" />
    </n-layout-header>
    <!-- 内容 -->
    <n-layout>
      <tableList
        :buttons="currentRouteMetaList.buttons" :meta-length="metaLength"
        :meta-title-length="metaTitleLength"
      />
    </n-layout>
    <edit />
    <editTable />
  </n-space>
</template>

<style scoped>

</style>
