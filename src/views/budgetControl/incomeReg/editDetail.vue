<script setup lang="ts">
import type { DataTableColumns, FormInst } from 'naive-ui'
import { NInput } from 'naive-ui'
import { rules } from './common'

import { useAppStore } from '@/store'
const appStore = useAppStore()
const tHeight = ref(appStore.tHeight)

interface list {
  budControlPayCode?: string
  payType?: number | null
  dictValue?: string
  bankAccountNumber?: string
  bankName?: string
  budPayId?: string
  payTime?: string
  assetId?: string
  branchId?: string
  abstracts?: string
  budPayMoney?: string
  budControlPayList?: Array<any>
  feeType?: number
  ifCorrelation?: string
  commissionSum?: string
  actualAmountSum?: string
}
interface dataList {
  modalVisible: boolean
  editData: object
  mainData: list
  flag: boolean
}
const loading = ref<boolean>(false)
const Data: dataList = reactive({
  modalVisible: false,
  editData: {},
  mainData: {},
  flag: true,
})
interface RowData {
  budSubjectId: string
  budInOut: string
  compileCode: string
  eachAmount: number
  commission: number
  actualAmount: number
  budCompileId: string
}
const tableData = ref()

const columns: DataTableColumns<RowData> = [
  { type: 'selection' },
  {
    title: '预算内/外',
    align: 'center',
    width: 180,
    key: 'budInOutName',
  },

  {
    title: '预算编号',
    align: 'center',
    width: 180,
    key: 'compileCode',
  },

  {
    title: '预算事项明细',
    align: 'center',
    width: 180,
    key: 'matter',
  },

  {
    title: '预算科目',
    align: 'center',
    width: 180,
    key: 'codeAndName',
  },
  {
    title: '期间时间',
    key: 'periodDate',
    align: 'center',
    width: 180,
    ellipsis: { tooltip: true },
  },
  {
    title: '收入金额',
    key: 'eachAmount',
    align: 'center',
    width: 180,
    ellipsis: { tooltip: true },
  },
  {
    title: '手续费',
    key: 'commission',
    align: 'center',
    width: 180,
    ellipsis: { tooltip: true },
  },
  {
    title: '实际收入金额',
    key: 'actualAmount',
    align: 'center',
    width: 180,
    ellipsis: { tooltip: true },
  },

]
const instance = getCurrentInstance()

const formRef = ref<FormInst | null>(null)

onMounted(() => {
  instance?.proxy?.$Bus.on('editDetail', (row: any) => {
    row ? Data.editData = JSON.parse(JSON.stringify(row)) : Data.editData = {}
    Data.modalVisible = !Data.modalVisible
    Data.mainData = {}
    tableData.value = []
    Object.assign(Data.mainData, Data.editData)
    tableData.value = Data.mainData.budControlPayList
  })
})
</script>

<template>
  <n-modal
    v-model:show="Data.modalVisible" class="custom-card" preset="card" title="收入登记详情" size="huge"
    :style="{ minHeight: `${tHeight}px` }"
  >
    <n-card title="基本数据">
      <n-form
        ref="formRef" label-placement="top" :model="Data.mainData" label-width="120" require-mark-placement="left"
        :rules="rules"
      >
        <n-grid :cols="24" :x-gap="24">
          <n-form-item-gi label="收入编号" span="6" path="budControlPayCode">
            <NInput v-model:value="Data.mainData.budControlPayCode" clearable placeholder="请输入" disabled />
          </n-form-item-gi>
          <n-form-item-gi label="收入方式" span="6" path="payType">
            <NInput
              v-model:value="Data.mainData.dictValue" disabled clearable wh-full placeholder="请输入"
              :show-button="false"
            />
          </n-form-item-gi>

          <n-form-item-gi label="银行账号" span="6" path="bankAccountNumber">
            <NInput
              v-model:value="Data.mainData.bankAccountNumber" disabled clearable wh-full placeholder="请输入"
              :show-button="false"
            />
          </n-form-item-gi>
          <!-- <n-form-item-gi label="产权结构名称" span="6" path="assetName">
                    <NInput v-model:value="Data.mainData.assetName" clearable placeholder="请输入" disabled />
                  </n-form-item-gi>
                  <n-form-item-gi label="管理结构名称" span="6" path="branchName">
                    <NInput v-model:value="Data.mainData.branchName" clearable placeholder="请输入" disabled />
                  </n-form-item-gi> -->
          <n-form-item-gi label="银行名称" span="6" path="bankName">
            <NInput v-model:value="Data.mainData.bankName" clearable placeholder="请输入" disabled />
          </n-form-item-gi>

          <n-form-item-gi label="制定日期" span="6" path="payTime">
            <n-date-picker
              v-model:formatted-value="Data.mainData.payTime" value-format="yyyy-MM-dd" type="date" clearable
              placeholder="请输入" :style="{ width: '100%' }" disabled
            />
          </n-form-item-gi>
          <n-form-item-gi label="总金额" span="6" path="budPayMoney">
            <NInput
              v-model:value="Data.mainData.budPayMoney" disabled clearable wh-full placeholder="请输入"
              :show-button="false"
            />
          </n-form-item-gi>
          <n-form-item-gi label="手续费总金额" span="6" path="commissionSum">
            <NInput
              v-model:value="Data.mainData.commissionSum" disabled clearable wh-full placeholder="请输入"
              :show-button="false"
            />
          </n-form-item-gi>
          <n-form-item-gi label="实际收入总金额" span="6" path="actualAmountSum">
            <NInput
              v-model:value="Data.mainData.actualAmountSum" disabled clearable wh-full placeholder="请输入"
              :show-button="false"
            />
          </n-form-item-gi>

          <n-form-item-gi label="摘要" span="12" path="abstracts">
            <NInput v-model:value="Data.mainData.abstracts" disabled clearable placeholder="请输入" />
          </n-form-item-gi>
        </n-grid>
      </n-form>
    </n-card>
    <n-card mt-10>
      <n-layout-header flex>
        <n-space flex-1 m-auto text-16 font-600>
          单据数据
        </n-space>
      </n-layout-header>
      <n-data-table
        :style="{ minHeight: `${tHeight - 500}px` }"
        flex-height
        default-expand-all single-column striped :columns="columns"
        :row-key="(row: RowData) => row.compileCode" :data="tableData" :loading="loading" :scroll-x="2000"
      />
    </n-card>
  </n-modal>
</template>

