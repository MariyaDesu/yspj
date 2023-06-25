<script setup lang="ts">
import searchHeader from './search.vue'
import tableList from './tableList.vue'
const router = useRouter()
const { currentRoute } = router
const currentRouteMetaList = reactive({
  buttons: currentRoute.value.meta.buttons as string[],
})
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
      <tableList />
    </n-layout>
  </n-space>
</template>

<style scoped>

</style>
