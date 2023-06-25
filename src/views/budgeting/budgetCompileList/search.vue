<script setup lang="ts">
import { NButton, NText } from 'naive-ui'
import type { Search } from './interface'
import { baseApi } from '@/api/baseApi'
import { formatDrop, renderIcon, showBtn } from '@/utils/common'
import { useBaseApiListStore } from '@/store'
const props = defineProps<{
  buttons: string[]
}>()
const baseApiListStore = useBaseApiListStore()

const search: Search.ISearch = reactive({})

const options: Search.IOption = reactive({
  assetOptions: [],
  branchOptions: [],
  deptOptions: [],
  stateOptions: [
    {
      state: 0,
      stateName: '编制中',
    },
    {
      state: 1,
      stateName: '已保存',
    },
    {
      state: 4,
      stateName: '审批中',
    },
    {
      state: 5,
      stateName: '未通过',
    },
    {
      state: 6,
      stateName: '已完结',
    },
  ],
  budProOptions: [],

})

const loading: Search.ILoading = reactive({})
const instance = getCurrentInstance()
const editHandle = () => {
  instance?.proxy?.$Bus.emit('edit', { type: true })
}

const searchHandle = () => {
  instance?.proxy?.$Bus.emit('search', search)
}

const submitList = () => {
  instance?.proxy?.$Bus.emit('submitList')
}

const submitProessList = () => {
  instance?.proxy?.$Bus.emit('submitProessList')
}
//  含明细导出
const exportHandle = () => {
  instance?.proxy?.$Bus.emit('exportsExcel')
}
//  不含明细导出
const exportHandleNo = () => {
  instance?.proxy?.$Bus.emit('exportsExcelNo')
}

const btnoptions = reactive(
  [
    {
      label: () => h(NText,
        {
          size: 'small',
          onClick: () => exportHandle(),
        },
        { default: () => '含明细导出', icon: renderIcon('material-symbols:arrow-circle-right-outline', { size: 20 }) }),
      key: 'return',
    },
    {
      label: () => h(NText,
        {
          size: 'small',
          onClick: () => exportHandleNo(),
        },
        { default: () => '不含明细导出', icon: renderIcon('material-symbols:arrow-circle-right-outline', { size: 20 }) }),
      key: 'returnNo',

    },

  ],
)

async function importHandle(ev) {
  try {
    const formdata = new FormData()
    formdata.append('file', ev.file.file)
    loading.import = true
    const res = await baseApi.budCompileImports(formdata)
    if (res.code === 200)
      window.$message?.success('导入成功')
    else
      window.$message?.error(`${res.message}`)
    searchHandle()
    loading.import = false
  }
  catch (error) {
    console.error(error)
    loading.import = false
    searchHandle()
  }
}

async function fetchDept(val: number | undefined) {
  if (!val)
    return
  const res = await baseApi.fetchDept({ assetId: val })
  if (res.code === 200) {
    formatDrop(res.data)
    options.deptOptions = res.data
  }
}

// 模板导出
function download() {
  const a = document.createElement('a')
  const evt = document.createEvent('MouseEvents')
  a.download = '预算录入导入模板'
  a.href = '/document/预算录入导入模板.xlsx'
  evt.initEvent('click', true, true)
  a.dispatchEvent(evt)
  window.URL.revokeObjectURL(a.href)
}

onMounted(() => {
  options.assetOptions = baseApiListStore.assetUserInfo
  options.branchOptions = baseApiListStore.branchUserInfo
  options.budProOptions = baseApiListStore.budProgrammeInfo
})
</script>

<template>
  <n-space vertical>
    <n-form
      ref="formRef" label-placement="top" :model="search" label-width="100"
      size="small"
      :show-feedback="false"
      inline
    >
      <n-grid :cols="24" :x-gap="24">
        <n-form-item-gi span="4" label="预算编制编码">
          <n-input v-model:value="search.compileCode" />
        </n-form-item-gi>

        <n-form-item-gi label="产权结构" span="4" path="assetId">
          <NSelect
            v-model:value="search.assetId" label-field="assetName" value-field="assetId" filterable
            :options="options.assetOptions" placeholder="请选择" clearable
            @update:value="fetchDept(search.assetId)"
          />
        </n-form-item-gi>
        <n-form-item-gi label="管理结构" span="4" path="branchId">
          <NSelect
            v-model:value="search.branchId" clearable filterable :options="options.branchOptions"
            label-field="branchName" value-field="branchId" placeholder="请选择"
          />
        </n-form-item-gi>
        <n-form-item-gi label="部门" span="4" path="deptId">
          <NCascader
            v-model:value="search.deptId" label-field="deptName" value-field="deptId" filterable
            :options="options.deptOptions" placeholder="请选择" clearable :disabled="!search.assetId"
          />
        </n-form-item-gi>
        <n-form-item-gi label="状态" span="4" path="state">
          <NSelect
            v-model:value="search.state" clearable filterable :options="options.stateOptions"
            label-field="stateName" value-field="state" placeholder="请选择"
          />
        </n-form-item-gi>
        <n-form-item-gi label="预算方案" path="budProgrammeId" span="4">
          <NSelect
            v-model:value="search.budProgrammeId" label-field="name" value-field="id" filterable
            :options="options.budProOptions" placeholder="请选择" clearable
          />
        </n-form-item-gi>
      </n-grid>
    </n-form>
    <n-space v-if="props.buttons.length === 0 ? false : true">
      <n-upload
        :show-file-list="false" @change="importHandle"
      >
        <NButton v-if="showBtn('导入', props.buttons)" type="info" :loading="loading.import">
          <template #icon>
            <icon-mingcute:file-import-line />
          </template>
          导入
        </NButton>
      </n-upload>

      <NDropdown v-if="showBtn('导出', props.buttons)" trigger="click" :loading="loading.export" :options="btnoptions">
        <NButton type="info">
          <template #icon>
            <icon-uil:file-import />
          </template>
          导出
        </NButton>
      </NDropdown>

      <NButton v-if="showBtn('模板导出', props.buttons)" type="warning" :loading="loading.download" @click="download">
        <template #icon>
          <icon-uil:file-import />
        </template>
        模板导出
      </NButton>
      <NButton v-if="showBtn('新增', props.buttons)" type="warning" :loading="loading.edit" @click="editHandle">
        <template #icon>
          <icon-material-symbols-add />
        </template>
        新增
      </NButton>
      <NButton v-if="showBtn('批量保存', props.buttons)" :loading="loading.submitList" type="warning" @click="submitList">
        <template #icon>
          <icon-material-symbols-add />
        </template>
        批量保存
      </NButton>
      <NButton v-if="showBtn('批量提交', props.buttons)" :loading="loading.submitProessList" type="warning" @click="submitProessList">
        <template #icon>
          <icon-material-symbols-add />
        </template>
        批量提交
      </NButton>
      <NButton v-if="showBtn('查找', props.buttons)" :loading="loading.search" type="primary" @click="searchHandle">
        查找 ( F )
      </NButton>
    </n-space>
  </n-space>
</template>

<style scoped>

</style>

