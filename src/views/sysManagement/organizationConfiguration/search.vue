<script setup lang="ts">
import type { CascaderOption, SelectOption } from 'naive-ui'
import { baseApi } from '@/api/baseApi'

import { formatDrop, showBtn } from '@/utils/common'
const props = defineProps<{
  buttons: string[]
}>()
interface searchKey {
  keyWord?: string
  tell?: string
  bankId?: string
  branchType?: string
  parentId?: string
  branchBusType?: string
  bankName?: string
}
const search: searchKey = reactive({})

const instance = getCurrentInstance()
const editHandle = () => {
  instance?.proxy?.$Bus.emit('edit')
}
const deleteHandle = () => {
  instance?.proxy?.$Bus.emit('delete')
}

const searchHandle = () => {
  instance?.proxy?.$Bus.emit('search', search)
}
interface IOption {
  parentBranchOptions: CascaderOption[]
  bankBusNameOptions: SelectOption[]
}
const options: IOption = reactive ({
  parentBranchOptions: [],
  bankBusNameOptions: [],
})

async function fetchBranch() {
  const res = await baseApi.fetchBranch({})
  formatDrop(res.data)
  options.parentBranchOptions = res.data
}

const loading = ref(false)
const exportHandle = () => {
  instance?.proxy?.$Bus.emit('exportsExcel')
}

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
        <n-form-item label="关键词" w-200>
          <n-input v-model:value="search.keyWord" />
        </n-form-item>
        <n-form-item label="父级管理结构名称" path="branchId">
          <n-cascader
            v-model:value="search.parentId"
            w-300
            :show-path="false"
            label-field="branchName"
            value-field="branchId"
            children-field="children"
            :options="options.parentBranchOptions"
            clearable
            @click="fetchBranch"
          />
        </n-form-item>
      </n-form>
    </n-space>
    <n-space v-if="props.buttons.length === 0 ? false : true">
      <NButton v-if="showBtn('导出', props.buttons)" type="info" :loading="loading" @click="exportHandle">
        <template #icon>
          <icon-uil:file-import />
        </template>
        导出
      </NButton>
      <NButton v-if="showBtn('新增', props.buttons)" type="warning" @click="editHandle">
        <template #icon>
          <icon-material-symbols-add />
        </template>
        新增
      </NButton>
      <NButton v-if="showBtn('查找', props.buttons)" type="primary" @click="searchHandle">
        查找 ( F )
      </NButton>

      <NButton v-if="showBtn('批量删除', props.buttons)" type="error" @click="deleteHandle">
        <template #icon>
          <icon-material-symbols:delete-outline />
        </template>
        批量删除
      </NButton>
    </n-space>
  </n-space>
</template>

<style scoped>

</style>

