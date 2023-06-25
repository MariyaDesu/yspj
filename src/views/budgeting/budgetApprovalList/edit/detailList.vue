<script setup lang="ts">
import type { DataTableColumns } from 'naive-ui'
import { NInput, NInputNumber } from 'naive-ui'
import { deepCopy } from '~/src/utils/common'
const props = defineProps<{
  showModal: boolean
  budProOptions: any
}>()
const emits = defineEmits(['update:showModal', 'updataTable'])
const instance = getCurrentInstance()
interface IData {
  showModal: boolean
  oldtable?: any
  mainData?: any
  summary?: any
}
interface RowData {
  id: number
  name: string
  index: number
  baseNumber: number
  budSubjectId: number
  matter: string
  contractNumber: string
  assetId: number
  branchId: number
  signingUnit: string
  contractAmount: string
  shouldPayAmount: string
  paidAmount: string
  unpaidAmount: string
  deptId: string
  adjustmentRate: string
}

interface ColumnList {
  column: DataTableColumns<RowData>
}

const loading = ref<boolean>(false)
const Data: IData = reactive({
  showModal: false,
  summary: 0,
  mainData: {
    baseNumber: 0,
    matter: '',
    budSubjectId: '',
    budCompileDataList: [],
  },
  oldtable: [],
})
instance?.proxy?.$Bus.on('initList', (row: any) => {
  Data.mainData = { ...row }
  Data.summary = row.baseNumber
  Data.oldtable = deepCopy(row.budCompileDataList)
  if (!row.id) {
    row.budCompileDataList.forEach((item) => {
      item.baseNumber = ''
    })
  }
  let num = 0
  row.budCompileDataList.forEach((item) => {
    if (item.baseNumber)
      num = num + Number(item.baseNumber)
  })
//   Data.summary = Number(num.toFixed(3).substring(0, num.toFixed(3).lastIndexOf('.') + 3))
})

const columnList: ColumnList = reactive({
  column: [
    { type: 'selection' },
    {
      title: '序号',
      align: 'center',
      width: 80,
      key: 'index',
      render: (_, index) => {
        return `${index + 1}`
      },
    },
    { title: '预算年份', key: 'budYear', align: 'center', width: 80, ellipsis: { tooltip: true } },
    { title: '预算期间', key: 'budPeriod', align: 'center', width: 80, ellipsis: { tooltip: true } },
    {
      title: '预算期间基准数',
      key: 'baseNumber',
      align: 'center',
      width: 80,
      ellipsis: { tooltip: true },
    },
    {
      title: '调整率',
      key: 'adjustmentRate',
      align: 'center',
      width: 80,
      ellipsis: { tooltip: true },
      render: (row, index) => {
        return row.adjustmentRate ? `${row.adjustmentRate}%` : '0.00%'
      },
    },

  ],
})

watch(() => props.showModal, (newVal: boolean, oldVal) => {
  Data.showModal = newVal
})

watch(() => Data.showModal, (val, old) => {
  if (!val)
    emits('update:showModal', val) // 此处的update亦要写
})
</script>

<template>
  <n-modal
    v-model:show="Data.showModal" class="custom-card" preset="card" title="预算数据详情" size="huge"
  >
    <n-card title="基本数据">
      <n-form label-placement="top" :model="Data.mainData" label-width="120" require-mark-placement="left">
        <n-grid :cols="24" :x-gap="24">
          <n-form-item-gi label="预算编制代码" span="8">
            <NInput v-model:value="Data.mainData.compileCode" clearable placeholder="请输入" disabled />
          </n-form-item-gi>
          <n-form-item-gi label="预算事项" span="8">
            <NInput v-model:value="Data.mainData.compileName" clearable placeholder="请输入" disabled />
          </n-form-item-gi>
          <!-- <n-form-item-gi label="预算方案" path="budProgrammeId" span="8">
            <NSelect
              v-model:value="Data.mainData.budProgrammeId" disabled label-field="name" value-field="id" filterable
              :options="options.budProOptions" placeholder="请选择" span="6"
            />
          </n-form-item-gi> -->
          <n-form-item-gi label="预算方案" path="budProgrammeId" span="8">
            <NInput v-model:value="Data.mainData.budProgrammeName" clearable placeholder="请输入" disabled />
          </n-form-item-gi>

          <n-form-item-gi label="预算基准数" span="8">
            <NInputNumber
              v-model:value="Data.mainData.baseNumber" clearable wh-full placeholder="请输入" disabled
              :show-button="false"
            />
          </n-form-item-gi>
          <n-form-item-gi label="总数" span="8">
            <NInputNumber
              v-model:value="Data.summary" clearable wh-full placeholder="请输入" :show-button="false"
              disabled
            />
          </n-form-item-gi>
        </n-grid>
      </n-form>
    </n-card>
    <n-data-table
      default-expand-all single-column striped :columns="columnList.column"
      :row-key="(row: RowData) => row.id" :data="Data.oldtable" :loading="loading" :scroll-x="1200"
    />
  </n-modal>
</template>

<style scoped>

</style>
