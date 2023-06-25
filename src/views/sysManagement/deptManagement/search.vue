<script setup lang="ts">
import type { CascaderOption } from 'naive-ui'
import { baseApi } from '@/api/baseApi'
import { formatDrop, showBtn } from '@/utils/common'

const props = defineProps<{
  buttons: string[]
}>()
interface searchKey {
  deptName?: string
  deptCode?: string
  assetId?: number
  supDept?: string
}
const loading = ref(false)

const search: searchKey = reactive({
})

const instance = getCurrentInstance()
const editHandle = () => {
  instance?.proxy?.$Bus.emit('edit')
}
// const deleteHandle = () => {

// }
const searchHandle = () => {
  instance?.proxy?.$Bus.emit('search', search)
}

const deleteHandle = () => {
  instance?.proxy?.$Bus.emit('delete')
}
interface opt {
  assetOptions: CascaderOption[]
  deptOptions: CascaderOption[]
}
const options: opt = reactive({
  assetOptions: [],
  deptOptions: [],
})

async function fetchAssetOptionsList() {
  const res = await baseApi.getAssetList({})
  formatDrop(res.data)
  options.assetOptions = res.data
}

async function fetchDept(val: number | undefined) {
  const res = await baseApi.fetchDept({ assetId: val })
  formatDrop(res.data)
  options.deptOptions = res.data
}

const exportHandle = () => {
  instance?.proxy?.$Bus.emit('exportsExcel')
}
onMounted(() => {
  instance?.proxy?.$Bus.on('loading', (val: boolean) => {
    loading.value = val
  })
  fetchAssetOptionsList()
  // fetchDept()
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
        <n-form-item label="部门编码">
          <n-input v-model:value="search.deptCode" />
        </n-form-item>
        <n-form-item label="部门名称">
          <n-input v-model:value="search.deptName" />
        </n-form-item>
        <n-form-item label="产权结构" span="6" path="assetId">
          <NCascader
            v-model:value="search.assetId" label-field="assetName" value-field="assetId" filterable
            :options="options.assetOptions" placeholder="请选择" clearable children-field="children"
          />
        </n-form-item>
        <n-form-item label="上级部门" span="6" path="deptId">
          <NCascader
            v-model:value="search.supDept" label-field="deptName" value-field="deptId" filterable
            :options="options.deptOptions" placeholder="请选择" clearable
            :disabled="!search.assetId"
            @click="fetchDept(search.assetId)"
          />
        </n-form-item>
      </n-form>
    </n-space>
    <n-space v-if="props.buttons.length === 0 ? false : true">
      <NButton
        v-if="showBtn('导出', props.buttons)" type="info" :loading="loading"
        @click="exportHandle"
      >
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

