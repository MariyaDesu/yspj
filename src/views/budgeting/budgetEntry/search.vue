<script setup lang="ts">
import { showBtn } from '@/utils/common'
const props = defineProps<{
  buttons: string[]
}>()
const loading = ref(false)
const instance = getCurrentInstance()

const exportHandle = () => {
  instance?.proxy?.$Bus.emit('exportsExcel')
}

const subEnable = () => {
  instance?.proxy?.$Bus.emit('subEnable')
}

onMounted(() => {
  instance?.proxy?.$Bus.on('loading', (val: boolean) => {
    loading.value = val
  })
})
</script>

<template>
  <n-space v-if="props.buttons.length === 0 ? false : true" mb-10>
    <NButton v-if="showBtn('导出', props.buttons)" type="info" :loading="loading" @click="exportHandle">
      <template #icon>
        <icon-uil:file-import />
      </template>
      导出
    </NButton>

    <NButton v-if="showBtn('科目启用', props.buttons)" type="warning" @click="subEnable">
      <template #icon>
        <icon-carbon:subnet-acl-rules />
      </template>
      科目启用
    </NButton>
  </n-space>
</template>

<style scoped>

</style>

