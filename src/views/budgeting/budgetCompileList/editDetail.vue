<script setup lang="ts">
import type { DataTableColumns, FormInst } from 'naive-ui'
import { NButton, NCascader, NInput, NSelect } from 'naive-ui'
import type { Edit } from './interface'
import adjust from './editDetail/adjust.vue'
import detailList from './editDetail/detailList.vue'
import { renderIcon } from '@/utils/common'
import { budgetCompileListApi } from '@/api/budgetApi'
import { useBaseApiListStore } from '@/store'
const baseApiListStore = useBaseApiListStore()

const options: Edit.IOption = reactive({
  budProOptions: [],
  budSubOptions: [],
  assetOptions: [],
  contractStateOptions: [
    {
      contractState: -1,
      contractStateName: ' 预计签合同',
    },
    {
      contractState: 0,
      contractStateName: ' 有合同',
    }, {
      contractState: 1,
      contractStateName: ' 无合同',
    },
    {
      contractState: 2,
      contractStateName: ' /',
    },
  ],

  feeTypeOptions: [
    {
      feeType: 1,
      feeTypeName: '收入类',
    },
    {
      feeType: 2,
      feeTypeName: '支出类',
    },
  ],
  branchOptions: [],
  deptOptions: [],

})

interface ColumnList {
  columns: DataTableColumns<Edit.RowData>
  columnNos: DataTableColumns<Edit.RowData>
  column: DataTableColumns<Edit.RowData>
}

const loading = ref<boolean>(false)
const Data: Edit.IData = reactive({
  modalVisible: false,
  showModal: false,
  showAdjust: false,
  editData: {},
  mainData: {
    budCompileList: [
      { budCompileDataList: {} },
    ],
    budProgrammeId: '',
  },
  name: '',
  oldtable: [],
  showTable: false,
  keyIndex: 0,
  fileIndex: 0,
  fileEditIndex: null,
})

const tableData = ref()

const columnList: ColumnList = reactive({
  columns: [
    { type: 'selection' },
    {
      title: '预算科目',
      align: 'center',
      width: 120,
      key: 'budSubjectName',

    },
    {
      title: '预算事项明细',
      key: 'matter',
      align: 'center',
      width: 100,
      ellipsis: { tooltip: true },

    },
    {
      title: '合同编号',
      key: 'contractNumber',
      align: 'center',
      width: 100,
      ellipsis: { tooltip: true },

    },
    {
      title: '签约单位',
      key: 'signingUnit',
      align: 'center',
      width: 100,
      ellipsis: { tooltip: true },
    },
    {
      title: '合同金额',
      key: 'contractAmount',
      align: 'center',
      width: 80,

      ellipsis: { tooltip: true },
    },
    {
      title: '应结算金额',
      key: 'shouldPayAmount',
      align: 'center',
      width: 80,

      ellipsis: { tooltip: true },
    },
    {
      title: '已付金额',
      key: 'paidAmount',
      align: 'center',
      width: 80,

      ellipsis: { tooltip: true },
    },
    {
      title: '未付金额',
      key: 'unpaidAmount',
      align: 'center',
      width: 80,

      ellipsis: { tooltip: true },

    },
    {
      title: '本年预计付款金额',
      key: 'baseNumber',
      align: 'center',
      width: 80,
      ellipsis: { tooltip: true },
    },
    {
      title: '操作',
      key: 'actions',
      width: 120,
      align: 'center',
      fixed: 'right',
      render(row, index) {
        return [
          h(
            NButton,
            {
              size: 'small',
              type: 'info',
              onClick: () => handleEdit(row, index),
            },
            { icon: renderIcon('material-symbols:edit', { size: 14 }) },
          ),
          h(
            NButton,
            {
              size: 'small',
              type: 'warning',
              onClick: () => handleAdjust(row, index),
              style: {
                marginLeft: '10px',
              },
            },
            { icon: renderIcon('iconoir:attachment', { size: 14 }) },

          ),
        ]
      },
    },
  ],
  columnNos: [
    { type: 'selection' },
    {
      title: '预算科目',
      align: 'center',
      width: 120,
      key: 'budSubjectName',
    },
    {
      title: '预算事项明细',
      key: 'matter',
      align: 'center',
      width: 100,
      ellipsis: { tooltip: true },
    },
    {
      title: '本年预计收款金额',
      key: 'baseNumber',
      align: 'center',
      width: 80,
      ellipsis: { tooltip: true },

    },
    {
      title: '操作',
      key: 'actions',
      width: 120,
      align: 'center',
      fixed: 'right',
      render(row, index) {
        return [
          h(
            NButton,
            {
              size: 'small',
              type: 'info',
              onClick: () => handleEdit(row, index),
            },
            { icon: renderIcon('material-symbols:edit', { size: 14 }) },
          ),
          h(
            NButton,
            {
              size: 'small',
              type: 'warning',
              onClick: () => handleAdjust(row, index),
              style: {
                marginLeft: '10px',
              },
            },
            { icon: renderIcon('iconoir:attachment', { size: 14 }) },

          ),
        ]
      },
    },
  ],
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
    { title: '调整率', key: 'adjustmentRate', align: 'center', width: 80, ellipsis: { tooltip: true } },

  ],
})
const uploadTable: any = ref([])

// 查看附件
function handleAdjust(row, index) {
  Data.fileIndex = index
  Data.fileEditIndex = row.id
  uploadTable.value = tableData.value[Data.fileIndex].urlList ? tableData.value[Data.fileIndex].urlList : []
  tableData.value[Data.fileIndex].urlList = uploadTable.value
  Data.showAdjust = true
}

const instance = getCurrentInstance()

const formRef = ref<FormInst | null>(null)
// 给/editDetail/detailList 赋值
function ininDetailList(row) {
  instance?.proxy?.$Bus.emit('detailList', row)
}
// 查看预算数据详情
function handleEdit(row, index) {
  ininDetailList(row)
  Data.keyIndex = index
  Data.showModal = true
}
// 重置表格
function removeTable() {
  tableData.value = []
}

// 修改表格字段
function changeColumnTitle() {
  columnList.columns.forEach((item: any) => {
    if (Data.mainData.feeType === 1) {
      if (item.key === 'baseNumber')
        item.title = '本年预计收款金额'
      else if (item.key === 'paidAmount')
        item.title = '已收金额'

      else if (item.key === 'unpaidAmount')
        item.title = '未收金额'
    }
    else if (Data.mainData.feeType === 2) {
      if (item.key === 'baseNumber')
        item.title = '本年预计付款金额'
      else if (item.key === 'paidAmount')
        item.title = '已付金额'

      else if (item.key === 'unpaidAmount')
        item.title = '未付金额'
    }
  })

  columnList.columnNos.forEach((item: any) => {
    if (Data.mainData.feeType === 1) {
      if (item.key === 'baseNumber')
        item.title = '本年预计收款金额'
    }
    else if (Data.mainData.feeType === 2) {
      if (item.key === 'baseNumber')
        item.title = '本年预计付款金额'
    }
  })
}
onMounted(() => {
  instance?.proxy?.$Bus.on('detail', async (row: any) => {
    loading.value = true
    const res = await budgetCompileListApi.getBudCompileDataList({ name: '查看详情', compileCode: row.compileCode })
    if (res.code === 200) {
      Data.mainData = {}
      Data.modalVisible = !Data.modalVisible
      loading.value = false
      options.assetOptions = [
        {
          assetId: res.data.assetId,
          assetName: res.data.assetName,
        },
      ]
      options.branchOptions = [{
        branchId: res.data.branchId,
        branchName: res.data.branchName,
      }]
      options.deptOptions = [{
        deptId: res.data.deptId,
        deptName: res.data.deptName,
      }]
      options.budProOptions = [{
        id: res.data.budProgrammeId,
        name: res.data.budProgrammeName,
      }]
      Data.editData = res.data
      Object.assign(Data.mainData, Data.editData)
      tableData.value = res.data.budCompileList
      options.budSubOptions = baseApiListStore.budAccountInfo
      // 修改表格字段
      changeColumnTitle()
    }
    else {
      window.$notification?.warning({ title: `${res.message}`, duration: 2500 })
    }
  })
})
</script>

<template>
  <!-- 预算录入详情 -->
  <n-modal
    v-model:show="Data.modalVisible" class="custom-card" preset="card" title="查看详情" size="huge"
  >
    <n-card title="基本数据">
      <n-form ref="formRef" label-placement="top" :model="Data.mainData" label-width="auto" require-mark-placement="left">
        <n-grid :cols="24" :x-gap="24">
          <n-form-item-gi label="预算编制代码" span="6" path="compileCode">
            <NInput v-model:value="Data.mainData.compileCode" disabled clearable placeholder="请输入" />
          </n-form-item-gi>
          <n-form-item-gi label="预算事项" span="18" path="compileName">
            <NInput v-model:value="Data.mainData.compileName" disabled clearable placeholder="请输入" />
          </n-form-item-gi>
          <n-form-item-gi label="产权结构" span="6" path="assetId">
            <NSelect
              v-model:value="Data.mainData.assetId" disabled label-field="assetName" value-field="assetId"
              filterable :options="options.assetOptions" placeholder="请选择" clearable
            />
          </n-form-item-gi>
          <n-form-item-gi label="管理结构" span="6" path="branchId">
            <NSelect
              v-model:value="Data.mainData.branchId" clearable filterable :options="options.branchOptions" disabled
              label-field="branchName" value-field="branchId" placeholder="请选择"
            />
          </n-form-item-gi>
          <n-form-item-gi label="部门" span="6" path="deptId">
            <NCascader
              v-model:value="Data.mainData.deptId" label-field="deptName" value-field="deptId" filterable
              disabled :options="options.deptOptions" placeholder="请选择" clearable
            />
          </n-form-item-gi>
          <n-form-item-gi label="预算方案" path="budProgrammeId" span="6">
            <NSelect
              v-model:value="Data.mainData.budProgrammeId" disabled label-field="name" value-field="id" filterable
              :options="options.budProOptions" placeholder="请选择" clearable
            />
          </n-form-item-gi>
          <n-form-item-gi label="预算类型" span="6" path="feeType">
            <NSelect
              v-model:value="Data.mainData.feeType" label-field="feeTypeName" disabled clearable filterable
              value-field="feeType" :options="options.feeTypeOptions" placeholder="请选择" span="6"
            />
          </n-form-item-gi>
          <n-form-item-gi label="是否合同" span="6" path="contractState">
            <NSelect
              v-model:value="Data.mainData.contractState" disabled clearable filterable
              :options="options.contractStateOptions" label-field="contractStateName" value-field="contractState"
              placeholder="请选择" @update:value="removeTable"
            />
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
    <n-card mt-10>
      <n-layout-header flex>
        <n-space flex-1 m-auto text-16 font-600>
          预算数据
        </n-space>
      </n-layout-header>
      <n-data-table
        mt-10 default-expand-all single-column striped
        :columns="(Data.mainData.contractState === -1 || Data.mainData.contractState === 0) ? columnList.columns : columnList.columnNos"
        :row-key="(row: Edit.RowData) => row.id" :data="tableData" :loading="loading"
        :scroll-x="(Data.mainData.contractState === -1 || Data.mainData.contractState === 0) ? 2300 : 0"
      />
    </n-card>
    <n-card title="人员数据" mt-10>
      <n-layout flex-height>
        <n-form inline :label-width="80" :model="Data.mainData">
          <n-grid :cols="24" :x-gap="24">
            <n-form-item-gi label="编制人名称:" :span="8">
              <NInput v-model:value="Data.mainData.preparationName" clearable placeholder="请输入" disabled />
            </n-form-item-gi>
            <n-form-item-gi label="创建人名称:" :span="8">
              <NInput v-model:value="Data.mainData.createdName" clearable placeholder="请输入" disabled />
            </n-form-item-gi>
            <n-form-item-gi label="编辑人名称:" :span="8">
              <NInput v-model:value="Data.mainData.modifiedName" clearable placeholder="请输入" disabled />
            </n-form-item-gi>
          </n-grid>
        </n-form>
      </n-layout>
    </n-card>
  </n-modal>

  <detailList
    v-model:showModal="Data.showModal"
    v-model:bud-pro-options="options.budProOptions"
  />

  <adjust
    v-model:show-adjust="Data.showAdjust"
    :file-edit-index="Data.fileEditIndex"
    :upload-table="uploadTable"
    :bud-pro-options="options.budProOptions"
  />
</template>

