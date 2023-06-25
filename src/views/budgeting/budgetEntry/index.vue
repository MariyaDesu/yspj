<script setup lang="ts">
import searchHeader from './search.vue'
import tree from './tree.vue'
import tableList from './tableList.vue'
import edit from './edit.vue'
import subEnable from './subEnable.vue'
import { showBtnLength } from '@/utils/common'
const router = useRouter()
const { currentRoute } = router
const currentRouteMetaList = reactive({
  buttons: currentRoute.value.meta.buttons as string[],
})

const arrMeta = ['编辑', '停用']
const metaLength = showBtnLength(arrMeta, currentRouteMetaList.buttons)
const arrTitleMeta = ['新增', '查找']
const metaTitleLength = showBtnLength(arrTitleMeta, currentRouteMetaList.buttons)

const instance = getCurrentInstance()
onUnmounted(() => {
  instance?.proxy?.$Bus.all.clear()
})
</script>

<template>
  <n-space vertical size="large" bg-white h-full p-24>
    <n-layout has-sider>
      <n-layout-sider collapse-mode="width" :width="300" :native-scrollbar="false" bordered>
        <tree :buttons="currentRouteMetaList.buttons" />
      </n-layout-sider>
      <!-- 头部 -->
      <n-layout pl-10>
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
      </n-layout>
    </n-layout>
    <edit />
    <subEnable />
  </n-space>
</template>

<style scoped>

</style>
