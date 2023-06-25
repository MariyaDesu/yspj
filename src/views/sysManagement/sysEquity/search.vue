<script setup lang="ts">
import type { CascaderOption, SelectOption } from 'naive-ui'
import { baseApi } from '@/api/baseApi'
import { showBtn } from '@/utils/common'
const props = defineProps<{
  buttons: string[]
}>()
interface searchKey {
  assetName?: string
  branchId?: string
  assetCode?: string
  parentId?: string
  assetType?: string
  organType?: string
  legalRepresentative?: string
  taxNo?: string
}

const search: searchKey = reactive({
})

const instance = getCurrentInstance()
const editHandle = () => {
  instance?.proxy?.$Bus.emit('edit')
}
const searchHandle = () => {
  instance?.proxy?.$Bus.emit('search', search)
}

const deleteHandle = () => {
  instance?.proxy?.$Bus.emit('delete')
}

interface opt {
  deptStateOptions: CascaderOption[]
  assetOptions: CascaderOption[]
  assetTypeOptions: SelectOption[]
  organTypeOptions: SelectOption[]
}
const options: opt = reactive({
  deptStateOptions: [],
  assetOptions: [],
  assetTypeOptions: [],
  organTypeOptions: [],
})
async function fetchAssetOptionsList() {
  const res = await baseApi.getAssetList({})
  options.assetOptions = res.data
}
async function fetchAssetType() {
  const res = await baseApi.fetchAssetType({ keyWord: 'CQLX' })
  options.assetTypeOptions = res.data
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
        ref="formRef"
        inline
        :label-width="80"
        size="small"
        :show-feedback="false"
      >
        <n-form-item label="产权结构编码" :show-feedback="false">
          <n-input v-model:value="search.assetCode" />
        </n-form-item>
        <n-form-item label="产权结构名称" path="assetId">
          <n-input v-model:value="search.assetName" />
        </n-form-item>
        <n-form-item label="父级产权结构" path="parentId">
          <n-cascader
            v-model:value="search.parentId" label-field="assetName" value-field="assetId" filterable
            :options="options.assetOptions" placeholder="请选择" clearable
            children-field="children"
            @click="fetchAssetOptionsList"
          />
        </n-form-item>
        <n-form-item label="产权类型" path="assetType">
          <n-select
            v-model:value="search.assetType" filterable :options="options.assetTypeOptions"
            label-field="dictValue" value-field="keyValue"
            clearable placeholder="请选择"
            @click="fetchAssetType"
          />
        </n-form-item>
        <n-form-item label="法人代表">
          <n-input v-model:value="search.legalRepresentative" />
        </n-form-item>
        <n-form-item label="纳税号">
          <n-input v-model:value="search.taxNo" />
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

