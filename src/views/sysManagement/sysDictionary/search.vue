<script setup lang="ts">
import { showBtn } from '@/utils/common'
const props = defineProps<{
  buttons: string[]
}>()
interface searchKey {
  dictName?: string
}
const search: searchKey = reactive({})

const instance = getCurrentInstance()

const searchHandle = () => {
  instance?.proxy?.$Bus.emit('search', search)
}

const loading = ref(false)

onMounted(() => {
  instance?.proxy?.$Bus.on('loading', (val: boolean) => {
    loading.value = val
  })
})
</script>

<template>
  <n-space vertical>
    <n-space>
      <n-form
        inline
        :label-width="80"
        size="small"
        :show-feedback="false"
      >
        <n-form-item label="字典名字">
          <n-input v-model:value="search.dictName" />
        </n-form-item>
      </n-form>
    </n-space>
    <n-space v-if="props.buttons.length === 0 ? false : true">
      <NButton v-if="showBtn('查找', props.buttons)" type="primary" @click="searchHandle">
        查找 ( F )
      </NButton>
    </n-space>
  </n-space>
</template>

<style scoped>

</style>

