<script setup lang="ts">
import tree from './tree.vue'
import edit from './edit.vue'
import btnEdit from './btnEdit.vue'
import { useAppStore } from '@/store'

const appStore = useAppStore()
const router = useRouter()
const { currentRoute } = router
const currentRouteMetaList = reactive({
  buttons: currentRoute.value.meta.buttons as string[],
})

const tHeight = ref(appStore.tHeight - 220)
const instance = getCurrentInstance()
onUnmounted(() => {
  instance?.proxy?.$Bus.all.clear()
})
</script>

<template>
  <n-space vertical size="large" bg-white h-full p-24>
    <n-scrollbar x-scrollable>
      <tree :buttons="currentRouteMetaList.buttons" style="white-space: nowrap" flex-height :style="{ minHeight: `${tHeight}px` }" />
    </n-scrollbar>

    <edit />
    <btnEdit />
  </n-space>
</template>

<style scoped>

</style>
