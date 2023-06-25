<script setup lang="ts">
import type { CascaderOption, SelectOption } from 'naive-ui'
import { NButton, NText } from 'naive-ui'
import { baseApi } from '@/api/baseApi'
import { formatDrop, formatSelectDrop, renderIcon, showBtn } from '@/utils/common'
const props = defineProps<{
  buttons: string[]
}>()
interface searchKey {
  bankName?: string
  assetId?: string
  branchId?: string
  payType?: string
  bankAccountNumber?: string
  payTime?: string
  budControlPayCode?: string
  abstracts?: string
}
interface IOption {
  assetOptions: SelectOption[]
  deptStateOptions: SelectOption[]
  deptOptions: CascaderOption[]
  bankTypeOptions: SelectOption[]
  payTypeOptions: SelectOption[]
}

const options: IOption = reactive({
  assetOptions: [],
  deptStateOptions: [],
  deptOptions: [],
  bankTypeOptions: [],
  payTypeOptions: [],
})

const search: searchKey = reactive({
})

const Data = reactive({
  assetId: null,
  branchId: null,
  deptId: null,
  incomeType: 1,
})
const loading = reactive({
  import: false,
  export: false,
  download: false,
  submitList: false,
  submitProessList: false,
})
const instance = getCurrentInstance()
const editHandle = () => {
  if (Data.assetId !== null && Data.branchId !== null && Data.deptId !== null)
    instance?.proxy?.$Bus.emit('edit', Data)

  else
    window.$message?.error('请先选择对应的数据')
}

const searchHandle = () => {
  instance?.proxy?.$Bus.emit('search', search)
}

const exportHandle = () => {
  instance?.proxy?.$Bus.emit('exportsExcel')
}

const exportHandleNo = () => {
  instance?.proxy?.$Bus.emit('exportsExcelNo')
}

const btnoptions = reactive(
  [
    {
      label: () => h(NText,
        {
          size: 'small',
          // type: 'info',
          onClick: () => exportHandle(),
        },
        { default: () => '含明细导出', icon: renderIcon('material-symbols:arrow-circle-right-outline', { size: 20 }) }),
      key: 'return',

    },
    {
      label: () => h(NText,
        {
          size: 'small',
          // type: 'error',
          onClick: () => exportHandleNo(),
        },
        { default: () => '不含明细导出', icon: renderIcon('material-symbols:arrow-circle-right-outline', { size: 20 }) }),
      key: 'returnNo',

    },

  ],
)

async function fetchAssetOptionsList() {
  const res = await baseApi.getAssetAllList({})
  options.assetOptions = res.data
  formatSelectDrop(options.assetOptions)
}

async function fetchDeptState() {
  const res = await baseApi.getBranchAllList({})
  options.deptStateOptions = res.data
  formatSelectDrop(options.deptStateOptions)
}

async function fetchDept(val: number | null) {
  if (!val)
    return
  Data.deptId = null
  const res = await baseApi.fetchDept({ assetId: val })
  formatDrop(res.data)
  options.deptOptions = res.data
}
// const importHandle = () => {
//   instance?.proxy?.$Bus.emit('searchBudCompile', search)
// }

async function importHandle(ev) {
  try {
    const formdata = new FormData()
    formdata.append('file', ev.file.file)
    formdata.append('assetId', Data.assetId ?? 'null')
    formdata.append('branchId', Data.branchId ?? 'null')
    formdata.append('type', '1')
    loading.import = true

    const res = await baseApi.budControlPayImports(formdata)
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

const setAllExpand = () => {
  instance?.proxy?.$Bus.emit('setAllExpand')
}

const clearExpand = () => {
  instance?.proxy?.$Bus.emit('clearExpand')
}

function beforeUpload(event) {
  if (Data.assetId === null ? true : Data.branchId === null ? true : Data.deptId === null) {
    event.stopPropagation()
    window.$message?.error('请先选择对应的数据')
  }
}

const submitList = () => {
  instance?.proxy?.$Bus.emit('submitList')
}

const submitProessList = () => {
  instance?.proxy?.$Bus.emit('submitProessList')
}

// 模板导出
function download() {
  const a = document.createElement('a')
  const evt = document.createEvent('MouseEvents')
  a.download = '调整登记导入模板'
  a.href = '/document/调整登记导入模板.xlsx'
  evt.initEvent('click', true, true)
  a.dispatchEvent(evt)
  window.URL.revokeObjectURL(a.href)
}
</script>

<template>
  <n-space vertical>
    <n-space>
      <n-form inline :label-width="180" size="small" :show-feedback="false">
        <n-form-item label="调整编号" span="6" path="budControlPayCode">
          <NInput v-model:value="search.budControlPayCode" clearable placeholder="请输入" />
        </n-form-item>

        <n-form-item label="产权结构名称" span="6" path="assetName">
          <NSelect
            v-model:value="search.assetId" label-field="assetName" value-field="assetId" filterable
            :options="options.assetOptions" placeholder="请选择" clearable children-field="children"
            @click="fetchAssetOptionsList"
          />
        </n-form-item>
        <n-form-item label="管理结构名称" span="6" path="branchName">
          <NSelect
            v-model:value="search.branchId" filterable :options="options.deptStateOptions" label-field="branchName"
            value-field="branchId" placeholder="请选择" clearable @click="fetchDeptState"
          />
        </n-form-item>
        <n-form-item label="银行名称">
          <n-input v-model:value="search.bankName" clearable />
        </n-form-item>
        <n-form-item label="银行账号">
          <n-input v-model:value="search.bankAccountNumber" clearable />
        </n-form-item>
        <n-form-item label="调整日期" span="6" path="payTime">
          <n-date-picker
            v-model:formatted-value="search.payTime" value-format="yyyy-MM-dd" type="date" clearable
            placeholder="请输入" :style="{ width: '100%' }"
          />
        </n-form-item>
        <n-form-item label="摘要">
          <n-input v-model:value="search.abstracts" clearable />
        </n-form-item>
      </n-form>
    </n-space>
    <n-space v-if="props.buttons.length === 0 ? false : true">
      <NButton v-if="showBtn('展开', props.buttons)" type="warning" @click="setAllExpand">
        <template #icon>
          <icon-ic:round-expand-more />
        </template>
        展开
      </NButton>

      <NButton v-if="showBtn('收起', props.buttons)" type="warning" @click="clearExpand">
        <template #icon>
          <icon-ic:round-expand-less />
        </template>
        收起
      </NButton>
      <NButton v-if="showBtn('模板导出', props.buttons)" type="warning" :loading="loading.download" @click="download">
        <template #icon>
          <icon-uil:file-import />
        </template>
        模板导出
      </NButton>
      <n-upload :show-file-list="false" @change="importHandle">
        <NButton v-if="showBtn('导入', props.buttons)" type="info" :loading="loading.import" @click="beforeUpload($event)">
          <template #icon>
            <icon-mingcute:file-import-line />
          </template>
          导入
        </NButton>
      </n-upload>

      <NDropdown v-if="showBtn('导出', props.buttons)" trigger="click" :options="btnoptions">
        <NButton type="info" :loading="loading.export">
          <template #icon>
            <icon-uil:file-import />
          </template>
          导出
        </NButton>
      </NDropdown>
      <NButton v-if="showBtn('新增', props.buttons)" type="warning" @click="editHandle">
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
      <NButton v-if="showBtn('批量提交', props.buttons)" :loading="loading.submitProessList" type="warning"
        @click="submitProessList">
        <template #icon>
          <icon-material-symbols-add />
        </template>
        批量提交
      </NButton>
      <NButton v-if="showBtn('查找', props.buttons)" type="primary" @click="searchHandle">
        查找 ( F )
      </NButton>
    </n-space>
    <n-space>
      <NSelect v-model:value="Data.assetId" label-field="assetName" value-field="assetId" filterable
        :options="options.assetOptions" placeholder="请选择产权结构" clearable children-field="children"
        @click="fetchAssetOptionsList" @update:value="fetchDept(Data.assetId)" />
      <NSelect v-model:value="Data.branchId" filterable :options="options.deptStateOptions" label-field="branchName"
        value-field="branchId" placeholder="请选择管理结构" clearable @click="fetchDeptState" />
      <NCascader v-model:value="Data.deptId" label-field="deptName" value-field="deptId" filterable
        :options="options.deptOptions" placeholder="请选择部门" clearable />
    </n-space>
  </n-space>
</template>

<style scoped></style>

