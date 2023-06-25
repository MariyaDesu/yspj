<script setup lang="ts">
import type { CascaderOption, SelectOption } from 'naive-ui'
import { baseApi } from '@/api/baseApi'
import { formatDrop, showBtn } from '@/utils/common'
const props = defineProps<{
  buttons: string[]
}>()
interface searchKey {
  assetId?: number
  processId?: string
  status?: string
  billTypeId?: string
  deptId?: string
  subjectId?: string
  branchId?: string
  nodeStatus?: number
  compileCode?: string
  projectNames?: string
}

const search: searchKey = reactive({
})

const instance = getCurrentInstance()

const searchHandle = () => {
  instance?.proxy?.$Bus.emit('search', search)
}

const batchPass = () => {
  instance?.proxy?.$Bus.emit('searchBatchPass', search)
}

const batchRecall = () => {
  instance?.proxy?.$Bus.emit('batchRecall', search)
}
const batchReturn = () => {
  instance?.proxy?.$Bus.emit('batchReturn', search)
}

interface IOption {
  billTypeOptions: SelectOption[]
  processOptions: SelectOption[]
  statusOptions: SelectOption[]
  deptOptions: CascaderOption[]
  deptStateOptions: CascaderOption[]
  assetOptions: CascaderOption[]
  budSubjectOptions: CascaderOption[]
  nodeStatusOptions: SelectOption[]
}
const options: IOption = reactive({
  billTypeOptions: [],
  processOptions: [],
  statusOptions: [],
  deptOptions: [],
  deptStateOptions: [],
  assetOptions: [],
  budSubjectOptions: [],
  nodeStatusOptions: [
    {
      nodeStatus: 0,
      nodeStatusName: '审批中',
    }, {
      nodeStatus: 2,
      nodeStatusName: '已通过',
    },
    {
      nodeStatus: 1,
      nodeStatusName: '未通过',
    },
  ],
})
// 获取单据类型下拉
async function getBillTypeList() {
  const res = await baseApi.getBillTypeList({})
  options.billTypeOptions = res.data.list
}
// 获取流程执行状态
async function fetchMenuType() {
  const res = await baseApi.fetchMenuType({ keyWord: 'SPZT' })
  if (res.data)
    options.statusOptions = res.data
}
// 获取部门下拉
async function fetchDept(val: number | undefined) {
  const res = await baseApi.fetchDept({ assetId: val })
  formatDrop(res.data)
  options.deptOptions = res.data
}
// 获取科目下拉
async function fetchSubject() {
  const res = await baseApi.getBudgetEntryMenuList({})
  options.budSubjectOptions = res.data
}
// 获取管理结构下拉
async function fetchDeptState() {
  const res = await baseApi.fetchBranch({})
  options.deptStateOptions = res.data
}
// 获取产权下拉
async function fetchAssetOptionsList() {
  const res = await baseApi.getAssetList({})
  formatDrop(res.data)
  options.assetOptions = res.data
}
</script>

<template>
  <n-space vertical>
    <n-form
      ref="formRef" label-placement="left" :model="search" label-width="100"
      size="small"
      :show-feedback="false"
      inline
    >
      <n-grid :cols="24" :x-gap="24">
        <n-form-item-gi span="5" label="预算编号">
          <n-input
            v-model:value="search.compileCode" clearable placeholder="请输入"
          />
        </n-form-item-gi>

        <n-form-item-gi span="5" label="单据类型">
          <n-select
            v-model:value="search.billTypeId" label-field="billTypeName" value-field="billTypeId" filterable
            :options="options.billTypeOptions" clearable placeholder="请选择" @click="getBillTypeList"
          />
        </n-form-item-gi>

        <n-form-item-gi label="产权结构" span="5" path="assetId">
          <NCascader
            v-model:value="search.assetId" label-field="assetName" value-field="assetId" filterable
            :options="options.assetOptions" placeholder="请选择" clearable children-field="children"
            @click="fetchAssetOptionsList"
          />
        </n-form-item-gi>

        <n-form-item-gi label="管理结构名称" span="5" path="branchId">
          <n-cascader
            v-model:value="search.branchId" filterable :options="options.deptStateOptions"
            label-field="branchName" value-field="branchId" placeholder="请选择" clearable @click="fetchDeptState"
          />
        </n-form-item-gi>

        <n-form-item-gi label="部门" span="4" path="deptId">
          <n-cascader
            v-model:value="search.deptId" clearable label-field="deptName" value-field="deptId"
            children-field="children" :options="options.deptOptions" :disabled="!search.assetId"
            @click="fetchDept(search.assetId)"
          />
        </n-form-item-gi>
        <n-form-item-gi span="5" label="立项名称" mt-10>
          <n-input
            v-model:value="search.projectNames" clearable placeholder="请输入"
          />
        </n-form-item-gi>

        <n-form-item-gi label="科目" span="5" path="subjectId" mt-10>
          <n-cascader
            v-model:value="search.subjectId" clearable filterable :options="options.budSubjectOptions"
            label-field="budSubjectName" value-field="budSubjectId" placeholder="请选择" @click="fetchSubject"
          />
        </n-form-item-gi>

        <n-form-item-gi label="节点状态" span="5" path="nodeStatus" mt-10>
          <n-select
            v-model:value="search.nodeStatus" clearable filterable :options="options.nodeStatusOptions"
            label-field="nodeStatusName" value-field="nodeStatus" placeholder="请选择"
          />
        </n-form-item-gi>

        <n-form-item-gi span="5" label="流程执行状态" mt-10>
          <n-select
            v-model:value="search.status" label-field="dictValue" value-field="keyValue" filterable
            :options="options.statusOptions" clearable placeholder="请选择" @click="fetchMenuType"
          />
        </n-form-item-gi>
      </n-grid>
    </n-form>
    <n-space v-if="props.buttons.length === 0 ? false : true">
      <NButton v-if="showBtn('查找', props.buttons)" type="primary" @click="searchHandle">
        查找 ( F )
      </NButton>
      <NButton v-if="showBtn('通过', props.buttons)" type="warning" @click="batchPass">
        <template #icon>
          <icon-material-symbols-add />
        </template>
        通过
      </NButton>
      <NButton v-if="showBtn('撤回', props.buttons)" type="warning" @click="batchRecall">
        <template #icon>
          <icon-material-symbols-add />
        </template>
        撤回
      </NButton>
      <NButton v-if="showBtn('退回', props.buttons)" type="warning" @click="batchReturn">
        <template #icon>
          <icon-material-symbols-add />
        </template>
        退回
      </NButton>
    </n-space>
  </n-space>
</template>

<style scoped></style>

