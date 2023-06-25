<script setup lang="ts">
import type { budgetProgramSearch } from './interface'
import { showBtn } from '@/utils/common'
const props = defineProps<{
  buttons: string[]
}>()

const search: budgetProgramSearch.Isearch = reactive({})
const instance = getCurrentInstance()
// 新增 触发edit页面
const editHandle = () => {
  instance?.proxy?.$Bus.emit('edit')
}
// 触发 tableList 页面
const searchHandle = () => {
  instance?.proxy?.$Bus.emit('search', search)
}
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
        <n-form-item label="关键词">
          <n-input v-model:value="search.keyWord" />
        </n-form-item>
      </n-form>
    </n-space>
    <n-space v-if="props.buttons.length === 0 ? false : true">
      <NButton v-if="showBtn('新增', props.buttons)" type="warning" @click="editHandle">
        <template #icon>
          <icon-material-symbols-add />
        </template>
        新增
      </NButton>
      <NButton v-if="showBtn('查找', props.buttons)" type="primary" @click="searchHandle">
        查找 ( F )
      </NButton>
    </n-space>
  </n-space>
</template>

<style scoped>

</style>

