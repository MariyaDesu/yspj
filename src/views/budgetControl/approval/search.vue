<script setup lang="ts">
import type { CascaderOption, SelectOption } from 'naive-ui'
import { baseApi } from '@/api/baseApi'
import { formatDrop, showBtn } from '@/utils/common'
const props = defineProps<{
  buttons: string[]
}>()
interface searchKey {
  compileCode?: string
  bankName?: string
  assetId?: string
  branchId?: string
  payType?: string
  bankAccountNumber?: string
  payTime?: string
  budControlPayCode?: string
  abstracts?: string
  status?: number
}

const search: searchKey = reactive({
})

const instance = getCurrentInstance()

const searchHandle = () => {
  instance?.proxy?.$Bus.emit('searchBudApproval', search)
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
  statusOptions: SelectOption[]
  assetOptions: CascaderOption[]
  deptStateOptions: CascaderOption[]
}
const options: IOption = reactive({
  statusOptions: [],
  assetOptions: [],
  deptStateOptions: [],
})

async function fetchAssetOptionsList() {
  const res = await baseApi.getAssetList({})
  formatDrop(res.data)
  options.assetOptions = res.data
}
async function fetchDeptState() {
  const res = await baseApi.fetchBranch({})

  options.deptStateOptions = res.data
}
async function fetchMenuType() {
  const res = await baseApi.fetchMenuType({ keyWord: 'SPZT' })
  if (res.data)
    options.statusOptions = res.data
}

onMounted(() => {
})
</script>

<template>
  <n-space vertical>
    <n-space>
      <n-form inline :label-width="180" size="small" :show-feedback="false">
        <n-form-item label="调整编号" span="6" path="compileCode">
          <NInput v-model:value="search.compileCode" clearable placeholder="请输入" />
        </n-form-item>

        <n-form-item label="产权结构名称" span="6" path="assetName">
          <NCascader
            v-model:value="search.assetId" label-field="assetName" value-field="assetId" filterable
            :options="options.assetOptions" placeholder="请选择" clearable children-field="children"
            @click="fetchAssetOptionsList"
          />
        </n-form-item>
        <n-form-item label="管理结构名称" span="6" path="branchName">
          <n-cascader
            v-model:value="search.branchId" filterable :options="options.deptStateOptions"
            label-field="branchName" value-field="branchId" placeholder="请选择" clearable @click="fetchDeptState"
          />
        </n-form-item>
        <n-form-item label="银行名称">
          <n-input v-model:value="search.bankName" clearable />
        </n-form-item>
        <n-form-item label="银行账号">
          <n-input v-model:value="search.bankAccountNumber" clearable />
        </n-form-item>
        <!-- <n-form-item label="调整方式" span="6" path="payType">
          <NSelect
            v-model:value="search.payType" filterable :options="options.payTypeOptions" clearable
            label-field="dictValue" value-field="keyValue" placeholder="请选择" @click="getDictionaryDetailByKeyWord()"
          />
        </n-form-item> -->
        <n-form-item label="调整日期" span="6" path="payTime">
          <n-date-picker
            v-model:formatted-value="search.payTime" value-format="yyyy-MM-dd" type="date" clearable
            placeholder="请输入" :style="{ width: '100%' }"
          />
        </n-form-item>
        <n-form-item label="摘要">
          <n-input v-model:value="search.abstracts" clearable />
        </n-form-item>
        <n-form-item label="流程执行状态">
          <n-select
            v-model:value="search.status" label-field="dictValue" value-field="keyValue" filterable
            :options="options.statusOptions" clearable placeholder="请选择" @click="fetchMenuType"
          />
        </n-form-item>
      </n-form>
    </n-space>
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

