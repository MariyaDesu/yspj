<script setup lang="ts">
import type { DataTableColumns } from 'naive-ui'
import { NInput, NInputNumber } from 'naive-ui'
import { deepCopy } from '~/src/utils/common'
const props = defineProps<{
  showModal: boolean
  mainData: any
  oldtable: any
  newtable: any
}>()
const emits = defineEmits(['update:showModal', 'updataTable'])
interface IData {
  showModal: boolean
  mainData?: any
  oldtable?: any
  newtable?: any
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

  afterMoney: number
  adjustmentRate: number
  note: string
}

interface ColumnList {
  columnOld: DataTableColumns<RowData>
  columnNew: DataTableColumns<RowData>

}
const instance = getCurrentInstance()

const loading = ref<boolean>(false)
const Data: IData = reactive({
  showModal: false,
  summary: 0,
  mainData: {
    compileCode: '',
    compileName: '',
    assetName: '',
    branchName: '',
    deptName: '',
    budProgrammeName: '',
    feeTypeName: '',
    contractStateName: '',
    projectName: '',
    preparationTime: '',
    note: '',
    authorizationMoney: '',
  },
  oldtable: [],
})

const columnList: ColumnList = reactive({
  columnOld: [],
  columnNew: [],
})

instance?.proxy?.$Bus.on('editDetail', (row: any) => {
  Data.mainData = { ...row }
  Data.oldtable = deepCopy(row.budCompileDataOverdueList)
  Data.newtable = deepCopy(row.budCompileDataList)
  if (!row.note) {
    columnList.columnOld = [
      { type: 'selection' },
      {
        title: '序号',
        align: 'center',
        width: 100,
        key: 'index',
        render: (_, index) => {
          return `${index + 1}`
        },
      },
      { title: '预算年份', key: 'budYear', align: 'center', width: 200, ellipsis: { tooltip: true } },
      { title: '预算期间', key: 'budPeriod', align: 'center', width: 200, ellipsis: { tooltip: true } },
      {
        title: '预算期间基准数',
        key: 'baseNumber',
        align: 'center',
        width: 200,
        ellipsis: { tooltip: true },
      },
      {
        title: '调整前预算数',
        key: 'lastChangeMoney',
        align: 'center',
        width: 200,
        ellipsis: { tooltip: true },
      },
      {
        title: '调整率',
        key: 'adjustmentRate',
        align: 'center',
        width: 200,
        ellipsis: { tooltip: true },
        render: (row, index) => {
          return row.adjustmentRate ? `${row.adjustmentRate}%` : '0.00%'
        },
      },

    ]
    columnList.columnNew = [
      { type: 'selection' },
      {
        title: '序号',
        align: 'center',
        width: 100,
        key: 'index',
        render: (_, index) => {
          return `${index + 1}`
        },
      },
      { title: '预算年份', key: 'budYear', align: 'center', width: 200, ellipsis: { tooltip: true } },
      { title: '预算期间', key: 'budPeriod', align: 'center', width: 200, ellipsis: { tooltip: true } },
      {
        title: '预算期间基准数',
        key: 'baseNumber',
        align: 'center',
        width: 200,
        ellipsis: { tooltip: true },
      },
      {
        title: '调整前预算数',
        key: 'lastChangeMoney',
        align: 'center',
        width: 200,
        ellipsis: { tooltip: true },

      },
      {
        title: '调整后预算数',
        key: 'afterMoney',
        align: 'center',
        width: 200,
        ellipsis: { tooltip: true },
      },

      {
        title: '调整率',
        key: 'adjustmentRate',
        align: 'center',
        width: 200,
        ellipsis: { tooltip: true },
        render: (row, index) => {
          return row.adjustmentRate ? `${row.adjustmentRate}%` : '0.00%'
        },
      },
    ]
    if (row.budCompileDataOverdueList.length > 0) {
      for (let i = 1; i <= row.budCompileDataOverdueList[0].budAdjustmentNumberList.length; i++) {
        columnList.columnOld.push({
          title: `第${i}次调整`,
          key: `afterMoney${i}`,
          align: 'center',
          width: 200,
          ellipsis: { tooltip: true },
        })
        // columnList.columnNew.push({
        //   title: `第${i}次调整`,
        //   key: `afterMoney${i}`,
        //   align: 'center',
        //   width: 200,
        //   ellipsis: { tooltip: true },
        // })
      }

      row.budCompileDataOverdueList.forEach((item, index) => {
        item.budAdjustmentNumberList.forEach((i, idx) => {
          Data.oldtable![index][`afterMoney${idx + 1}`] = i.afterMoney
        })
      })

      // row.budCompileDataList.forEach((item, index) => {
      //   item.budAdjustmentNumberList.forEach((i, idx) => {
      //     Data.newtable![index][`afterMoney${idx + 1}`] = i.afterMoney
      //   })
      // })
    }
  }
  else {
    Data.summary = row.baseNumber
    columnList.columnOld = [
      { type: 'selection' },
      {
        title: '序号',
        align: 'center',
        width: 100,
        key: 'index',
        render: (_, index) => {
          return `${index + 1}`
        },
      },
      { title: '预算年份', key: 'budYear', align: 'center', width: 200, ellipsis: { tooltip: true } },
      { title: '预算期间', key: 'budPeriod', align: 'center', width: 200, ellipsis: { tooltip: true } },
      {
        title: '预算期间基准数',
        key: 'baseNumber',
        align: 'center',
        width: 200,
        ellipsis: { tooltip: true },
      },
    ]
    columnList.columnNew = [
      { type: 'selection' },
      {
        title: '序号',
        align: 'center',
        width: 100,
        key: 'index',
        render: (_, index) => {
          return `${index + 1}`
        },
      },
      { title: '预算年份', key: 'budYear', align: 'center', width: 200, ellipsis: { tooltip: true } },
      { title: '预算期间', key: 'budPeriod', align: 'center', width: 200, ellipsis: { tooltip: true } },
      {
        title: '预算期间基准数',
        key: 'baseNumber',
        align: 'center',
        width: 200,
        ellipsis: { tooltip: true },
        render(row, index) {
          return [
            h(
              NInputNumber, {
                value: row.baseNumber,
                showButton: false,
                min: 0,
                onUpdateValue(v) {
                  Data.newtable![index].baseNumber = v
                },
                onBlur(v) {
                  let num = 0
                  const val = 0
                  if (!Data.newtable![index].baseNumber)
                    Data.newtable![index].baseNumber = 0

                  const toFixedNum = Data.newtable![index].baseNumber.toFixed(3)
                  Data.newtable![index].baseNumber = toFixedNum.substring(0, toFixedNum.lastIndexOf('.') + 3) || val.toFixed(3).substring(0, val.toFixed(3).lastIndexOf('.') + 3)
                  Data.newtable!.forEach((item: any) => {
                    if ((item.baseNumber))
                      num! += Number(item.baseNumber)
                  })
                  // Data.mainData.baseNumber = Number(num.toFixed(3).substring(0, num.toFixed(3).lastIndexOf('.') + 3))

                  Data.summary = num.toFixed(3).substring(0, num.toFixed(3).lastIndexOf('.') + 3)
                //   Data.mainData.budCompileList![Data.keyIndex].budCompileDataList = Data.newtable
                },

              },

            ),
          ]
        },
      },
      // {
      //   title: '调整率',
      //   key: 'adjustmentRate',
      //   align: 'center',
      //   width: 100,
      //   ellipsis: { tooltip: true },
      //   render: (row, index) => {
      //     return row.adjustmentRate ? `${row.adjustmentRate}%` : ''
      //   },
      // },
    ]
    let num = 0
    Data.newtable!.forEach((item: any) => {
      if ((item.baseNumber))
        num! += Number(item.baseNumber)
    })
    // Data.mainData.baseNumber = Number(num.toFixed(3).substring(0, num.toFixed(3).lastIndexOf('.') + 3))

    Data.summary = num.toFixed(3).substring(0, num.toFixed(3).lastIndexOf('.') + 3)
  }
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
    :mask-closable="false"
  >
    <n-card title="基本数据">
      <n-form ref="formRef" label-placement="top" :model="Data.mainData" label-width="120" require-mark-placement="left">
        <n-grid :cols="24" :x-gap="24">
          <n-form-item-gi label="预算编制代码" span="6" path="compileCode">
            <NInput v-model:value="Data.mainData.compileCode" disabled clearable placeholder="请输入" />
          </n-form-item-gi>
          <n-form-item-gi label="预算事项" span="18" path="compileName">
            <NInput v-model:value="Data.mainData.compileName" disabled clearable placeholder="请输入" />
          </n-form-item-gi>
          <n-form-item-gi label="产权结构" span="6" path="assetId">
            <NInput v-model:value="Data.mainData.assetName" disabled clearable placeholder="请输入" />
          </n-form-item-gi>
          <n-form-item-gi label="管理结构" span="6" path="branchId">
            <NInput v-model:value="Data.mainData.branchName" disabled clearable placeholder="请输入" />
          </n-form-item-gi>
          <n-form-item-gi label="部门" span="6" path="deptId">
            <NInput v-model:value="Data.mainData.deptName" disabled clearable placeholder="请输入" />
          </n-form-item-gi>
          <n-form-item-gi label="预算方案" path="budProgrammeId" span="6">
            <NInput v-model:value="Data.mainData.budProgrammeName" disabled clearable placeholder="请输入" />
          </n-form-item-gi>
          <n-form-item-gi label="预算类型" span="6" path="feeType">
            <NInput v-model:value="Data.mainData.feeTypeName" disabled clearable placeholder="请输入" />
          </n-form-item-gi>
          <n-form-item-gi label="是否合同" span="6" path="contractState">
            <NInput v-model:value="Data.mainData.contractStateName" disabled clearable placeholder="请输入" />
          </n-form-item-gi>
          <n-form-item-gi label="立项名称" span="6" path="projectName">
            <NInput v-model:value="Data.mainData.projectName" disabled clearable placeholder="请输入" />
          </n-form-item-gi>
          <n-form-item-gi label="编制日期" span="6" path="preparationTime">
            <n-date-picker
              v-model:formatted-value="Data.mainData.preparationTime" disabled value-format="yyyy-MM-dd"
              type="date" clearable placeholder="请输入" :style="{ width: '100%' }"
            />
          </n-form-item-gi>
          <n-form-item-gi v-if="Data.mainData.note === null" label="调整后金额（总计）" span="6">
            <NInputNumber
              v-model:value="Data.mainData.authorizationMoney" disabled clearable wh-full placeholder="请输入"
              :show-button="false"
            />
          </n-form-item-gi>
          <n-form-item-gi v-if="Data.mainData.note !== null" label="预算基准数" span="6">
            <NInputNumber
              v-model:value="Data.mainData.baseNumber" clearable wh-full placeholder="请输入"
              :show-button="false"
            />
          </n-form-item-gi>
          <n-form-item-gi v-if="Data.mainData.note !== null" label="总数" span="6">
            <NInputNumber
              v-model:value="Data.summary" clearable wh-full placeholder="请输入" :show-button="false"
              disabled
            />
          </n-form-item-gi>
          <n-form-item-gi label="编制说明" span="24" path="preparationDescription">
            <NInput
              v-model:value="Data.mainData.preparationDescription" type="textarea" :autosize="{
                minRows: 2,
              }" :style="{ width: '100%' }" disabled clearable placeholder="请输入"
            />
          </n-form-item-gi>
        </n-grid>
      </n-form>
    </n-card>
    <n-card title="历史数据" mt-20>
      <n-data-table
        default-expand-all single-column striped :columns="columnList.columnOld"
        :row-key="(row: RowData) => row.id" :data="Data.oldtable" :loading="loading"
        :scroll-x="columnList.columnOld.length * 200"
      />
    </n-card>
    <n-card title="调整数据" mt-20>
      <n-data-table
        default-expand-all single-column striped :columns="columnList.columnNew"
        :row-key="(row: RowData) => row.id" :data="Data.newtable" :loading="loading"
        :scroll-x="columnList.columnNew.length * 200"
      />
    </n-card>
  </n-modal>
</template>

<style scoped>

</style>
