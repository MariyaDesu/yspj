<script setup lang="ts">
import type { CascaderOption, DataTableColumns, SelectOption } from 'naive-ui'
import { NButton, NInput } from 'naive-ui'
import adjust from './editDetail/adjust.vue'
import detailList from './editDetail/detailList.vue'
import { renderIcon } from '@/utils/common'
import { budgetCompileListAlterApi } from '@/api/budgetApi'
import { baseApi } from '@/api/baseApi'
import { useBaseApiListStore } from '@/store'
const baseApiListStore = useBaseApiListStore()
interface IOption {
  budProOptions: SelectOption[]
  budSubOptions: CascaderOption[]
  assetOptions: SelectOption[]
  contractStateOptions: SelectOption[]
  feeTypeOptions: SelectOption[]
  branchOptions: SelectOption[]
  deptOptions: CascaderOption[]
}
const options: IOption = reactive({
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

const tableData = ref()

interface RowData {
  id: number
  index: number
  baseNumber: string
  budSubjectId: number
  afterMoney: number
  adjustmentRate: number
}
interface UploadRowData {
  fileUrl: string
  oldName: string
  id: number
}

interface IMainData {
  code?: string
  budSubjectId?: string
  budProgrammeId?: string
  preparationDescription?: string
  compileCode?: string
  compileName?: string
  baseNumber?: number
  budCompileList?: Array<any>
  preparationId?: string
  createdId?: string
  modifiedId?: string
  preparationName?: string
  createdName?: string
  modifiedName?: string
  assetId?: string
  deptId?: string
  branchId?: string
  contractState?: number
  feeType?: number
  preparationTime?: string
  budProgrammeName?: string
  authorizationMoney?: number
  projectName?: string
}
interface dataList {
  modalVisible: boolean
  editData: object
  mainData: IMainData
  name: string
  showTable: boolean
  oldtable?: any
  newtable?: any
  showModal: boolean
  showAdjust: boolean
  keyIndex: number
  summary: number
  num: number
  fileIndex: number
  fileEditIndex: any
  rowList: any
  isVisible: boolean
}

const loading = ref<boolean>(false)
const Data: dataList = reactive({
  modalVisible: false,
  showModal: false,
  showAdjust: false,
  editData: {},
  mainData: {
    budCompileList: [
      { budCompileDataList: {} },
    ],
    budProgrammeName: '',
  },
  // budCompileDataList: [],
  name: '',
  oldtable: [],
  newtable: [],
  showTable: false,
  keyIndex: 0,
  summary: 0,
  num: 0,

  fileIndex: 0,
  fileEditIndex: null,
  isVisible: false,
  rowList: {},
})

interface ColumnList {
  columns: DataTableColumns<RowData>
  columnNos: DataTableColumns<RowData>
  columnOld: DataTableColumns<RowData>
  columnNew: DataTableColumns<RowData>
  uploadColunm: DataTableColumns<UploadRowData>
}
// 之前的数据
const uploadTable: any = ref([])

// 临时存放的数据
function handleAdjust(row, index) {
  Data.fileIndex = index
  Data.fileEditIndex = row.id
  uploadTable.value = tableData.value[Data.fileIndex].urlList ? tableData.value[Data.fileIndex].urlList : []
  tableData.value[Data.fileIndex].urlList = uploadTable.value
  Data.showAdjust = true
}

async function handleView(row) {
  let type = ''
  if (row.fileFormat === 'pdf')
    type = 'application/pdf'

  else if (row.fileFormat === 'xls' || row.fileFormat === 'xlsx')
    type = 'application/vnd.ms-excel'

  else if (row.fileFormat === 'jpeg' || row.fileFormat === 'jpg' || row.fileFormat === 'png' || row.fileFormat === 'jfif')
    type = 'image/jpeg'

  const res: any = await baseApi.budAttachmentSelect({ oldName: row.oldName, fileUrl: row.fileUrl })
  const url = window.URL.createObjectURL(new Blob([res], { type }))
  const a = document.createElement('a')
  a.style.display = 'none'
  a.href = url
  a.download = row.oldName
  document.body.appendChild(a)
  a.click() // 执行下载
  window.URL.revokeObjectURL(a.href)
  document.body.removeChild(a)
}
const handleUploadDelete = (row, index) => {
  uploadTable.value.splice(index, 1)
}
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
      width: 100,
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
      width: 200,
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
  columnOld: [

  ],
  columnNew: [

  ],
  uploadColunm: [
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
    {
      title: '文件名称',
      key: 'oldName',
      align: 'center',
      width: 200,
      ellipsis: { tooltip: true },
    },
    {
      title: '操作',
      key: 'actions',
      width: 200,
      align: 'center',
      fixed: 'right',
      render(row, index) {
        return [
          h(
            NButton,
            {
              size: 'small',
              type: 'info',
              hidden: !row.id,
              onClick: () => handleView(row),
            },
            { default: () => '下载', icon: renderIcon('material-symbols:download-sharp', { size: 14 }) },
          ),
          h(
            NButton,
            {
              size: 'small',
              type: 'error',
              style: {
                marginLeft: '10px',
              },
              onClick: () => handleUploadDelete(row, index),
            },
            { default: () => '删除', icon: renderIcon('material-symbols:delete-outline', { size: 14 }) },
          ),
        ]
      },
    },
  ],
})

const instance = getCurrentInstance()
function fetchTableData() {
  instance?.proxy?.$Bus.emit('fetchData')
}
async function editMsg(type: number) {
  if (type === 1) {
    const res = await budgetCompileListAlterApi.saveAddBudCompileListAlterEdit(Data.mainData)
    if (res.code === 200) {
      window.$notification?.success({ title: '保存成功！', duration: 2500 })
      Data.modalVisible = false
    }
    else {
      window.$notification?.warning({ title: `${res.message}`, duration: 2500 })
    }
    fetchTableData()
  }
  else if (type === 0) {
    Data.modalVisible = false
  }
}
function initList(columnList) {
  instance?.proxy?.$Bus.emit('editDetail', columnList)
}
function handleEdit(row, index) {
  Data.keyIndex = index

  initList(row)

  Data.showModal = true
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
  instance?.proxy?.$Bus.on('changeBudComplieAlterTableEdit', async (row: any) => {
    loading.value = true
    const res = await budgetCompileListAlterApi.getBudCompileAlterDataList({ name: '查看详情', compileCode: row.compileCode })
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
      // Data.mainData.contractState = 0
    }

    else {
      window.$notification?.warning({ title: `${res.message}`, duration: 2500 })
    }

    changeColumnTitle()
    // }
  })
  options.budSubOptions = baseApiListStore.budAccountInfo
})
</script>

<template>
  <n-modal
    v-model:show="Data.modalVisible" class="custom-card" preset="card"
    title="查看详情" size="huge"
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
              placeholder="请选择"
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
        :row-key="(row: RowData) => row.id" :data="tableData" :loading="loading"
        :scroll-x="(Data.mainData.contractState === -1 || Data.mainData.contractState === 0) ? 2300 : 0"
      />
    </n-card>
    <n-card title="人员数据" mt-10>
      <n-layout flex-height>
        <n-form ref="formRef" inline :label-width="80" :model="Data.mainData">
          <n-grid :cols="24" :x-gap="24">
            <n-form-item-gi label="编制人名称" :span="8">
              <NInput v-model:value="Data.mainData.preparationName" clearable placeholder="请输入" disabled />
            </n-form-item-gi>
            <n-form-item-gi label="创建人名称" :span="8">
              <NInput v-model:value="Data.mainData.createdName" clearable placeholder="请输入" disabled />
            </n-form-item-gi>
            <n-form-item-gi label="编辑人名称" :span="8">
              <NInput v-model:value="Data.mainData.modifiedName" clearable placeholder="请输入" disabled />
            </n-form-item-gi>
          </n-grid>
        </n-form>
      </n-layout>
    </n-card>

    <template #footer>
      <NLayout text-center>
        <NButton type="info" mr-10 @click="editMsg(1)">
          保存
        </NButton>
        <NButton type="info" ml-10 @click="editMsg(0)">
          取消
        </NButton>
      </NLayout>
    </template>
  </n-modal>

  <detailList
    v-model:showModal="Data.showModal"
    :main-data="Data.mainData"
    :oldtable="Data.oldtable"
    :newtable="Data.newtable"
  />

  <adjust
    v-model:show-adjust="Data.showAdjust"
    :file-edit-index="Data.fileEditIndex"
    :upload-table="uploadTable"
    :bud-pro-options="options.budProOptions"
  />
</template>

