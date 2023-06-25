<script setup lang="ts">
import searchHeader from './search.vue'
import tableList from './tableList.vue'
import edit from './edit.vue'
import editDetail from './editDetail.vue'
import ProcessEdit from './processEdit.vue'
import { showBtnLength } from '@/utils/common'
const router = useRouter()
const { currentRoute } = router
const currentRouteMetaList = reactive({
  buttons: currentRoute.value.meta.buttons as string[],
})

const arrMeta = ['保存', '撤回', '查看详情', '编辑', '删除', '流程详情', '历史流程']
const metaLength = showBtnLength(arrMeta, currentRouteMetaList.buttons)
const arrTitleMeta = ['导入', '导出', '新增', '批量保存', '批量提交', '查找']
const metaTitleLength = showBtnLength(arrTitleMeta, currentRouteMetaList.buttons)

const instance = getCurrentInstance()
onUnmounted(() => {
  instance?.proxy?.$Bus.all.clear()
})
</script>

<template>
  <n-space vertical size="large" bg-white h-full p-24>
    <!-- 头部 -->
    <n-layout-header>
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
    <editDetail />
    <ProcessEdit />
  </n-space>
</template>

<style scoped>

</style>
