<script setup lang="ts">
import searchHeader from './search.vue'
import tableList from './tableList.vue'
import edit from './edit.vue'
import { showBtnLength } from '@/utils/common'
const router = useRouter()
const { currentRoute } = router
const currentRouteMetaList = reactive({
  buttons: currentRoute.value.meta.buttons as string[],
})
const arrMeta = ['编辑', '删除']
const metaLength = showBtnLength(arrMeta, currentRouteMetaList.buttons)

const arrTitleMeta = ['新增', '查找']
const metaTitleLength = showBtnLength(arrTitleMeta, currentRouteMetaList.buttons)

const instance = getCurrentInstance()
const isEdit = ref(false)
const Data = reactive({
  editData: {},
})

instance?.proxy?.$Bus.on('edit', (row: any) => {
  row ? Data.editData = row : Data.editData = {}
  isEdit.value = !isEdit.value
})

onUnmounted(() => {
  instance?.proxy?.$Bus.all.clear()
})
</script>

<template>
  <n-space v-if="!isEdit" vertical size="large" bg-white h-full p-24>
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
  </n-space>
  <n-space v-else vertical size="large" h-full p-24>
    <edit :edit-data="Data.editData" />
  </n-space>
</template>

<style scoped>

</style>
