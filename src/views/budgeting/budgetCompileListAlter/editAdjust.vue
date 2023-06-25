<script setup lang="ts">
import type { CascaderOption, DataTableColumns, FormInst, SelectOption } from 'naive-ui'
import { NButton, NCascader, NInput, NInputNumber, NSelect } from 'naive-ui'
import { rules } from './common'
import adjust from './editAdjust/adjust.vue'
import detailList from './editAdjust/detailList.vue'
import { deepCopy, formatDrop, renderIcon } from '@/utils/common'
import { budgetCompileListAlterApi, budgetCompileListApi } from '@/api/budgetApi'
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
interface list {
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
  assetId?: number
  deptId?: string
  branchId?: string
  contractState?: number | null
  feeType?: number
  preparationTime?: string
  projectName?: string
}
interface IData {
  modalVisible: boolean
  editData: object
  mainData: list
  name: string
  showTable: boolean
  oldtable?: Array<any>
  showModal: boolean
  showAdjust: boolean
  keyIndex: number
  summary?: number
  fileIndex: number
  fileEditIndex: any
  rowList: any
}

const Data: IData = reactive({
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
  rowList: {},
})

const tableData = ref()
const loading = ref<boolean>(false)
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
}
const instance = getCurrentInstance()
function fetchTableData() {
  instance?.proxy?.$Bus.emit('fetchData')
}
const formRef = ref<FormInst | null>(null)
// 保存
async function editMsg() {
  formRef.value?.validate(async (errors) => {
    if (!errors) {
      Data.mainData.budCompileList = tableData.value
      for (let i = 0; i < Data.mainData.budCompileList!.length; i++) {
        if (!Data.mainData.budCompileList![i].baseNumber || Data.mainData.budCompileList![i].baseNumber === '0.00') {
          Data.mainData.budCompileList![i].baseNumber = '0.00'
          Data.mainData.budCompileList![i].budCompileDataList.forEach((items) => {
            items.baseNumber = '0.00'
          })
        }
      }
      const res
        = JSON.stringify(Data.editData) === '{}'
          ? await budgetCompileListAlterApi.adjustmentAdd(Data.mainData)
          : await budgetCompileListApi.saveEditBudCompileListEdit(Data.mainData)

      if (res.code === 200) {
        window.$notification?.success({ title: '保存成功！', duration: 2500 })
        fetchTableData()
        Data.modalVisible = false
      }
      else {
        if (res.message === '该预算编制代码已存在') {
          await fetchCode()
          await editMsg()
        }
        else {
          window.$message?.error(`${res.message}`)
        }
      }
    }
    else {
      window.$message?.error('请填写必填项')
    }
  })
}

// 选择预算方案
async function changeBudPro() {
  try {
    const res = await baseApi.getBudProList({ id: Data.mainData.budProgrammeId })
    Data.oldtable = res.data
  }
  catch (error) {
    console.error(error)
    Data.oldtable = []
  }
}
// 判断预算编制代码是否有误
async function keyCheck() {
  if (Data.mainData.compileCode) {
    const res = await budgetCompileListApi.selectIfExist({ code: Data.mainData.compileCode, type: 2, assetId: Data.mainData.assetId ?? '' })
    if (res.code === 200)
      window.$notification?.success({ title: `${res.data}`, duration: 2500 })
    else window.$notification?.warning({ title: `${res.message}`, duration: 2500 })
  }
}
// 新增一行
function handleAdd() {
  if (Data.mainData.budProgrammeId) {
    if (Data.mainData.contractState === -1 || Data.mainData.contractState === 0) {
      tableData.value.push({
        budSubjectId: null,
        baseNumber: null,
        budCompileDataList: deepCopy(Data.oldtable),
        matter: null,
        contractNumber: null,
        signingUnit: null,
        contractAmount: null,
        shouldPayAmount: null,
        paidAmount: null,
        unpaidAmount: null,
      })
    }
    else if (Data.mainData.contractState === 1 || Data.mainData.contractState === 2) {
      tableData.value.push({
        budSubjectId: null,
        baseNumber: null,
        budCompileDataList: deepCopy(Data.oldtable),
      })
    }
    else {
      window.$notification?.warning({ title: '请选择合同', duration: 2500 })
    }
  }
  else {
    window.$notification?.warning({ title: '请选择预算方案', duration: 2500 })
  }
}
function initList(row) {
  instance?.proxy?.$Bus.emit('fetchinitList', row)
}
function handleEdit(row, index) {
  if (Data.oldtable!.length > 0) {
    Data.keyIndex = index
    row.budCompileDataList = Data.mainData.budCompileList![index].budCompileDataList
    row.compileCode = Data.mainData.compileCode
    row.compileName = Data.mainData.compileName
    row.budProgrammeId = Data.mainData.budProgrammeId
    initList(row)
    Data.showModal = true
  }
  else {
    window.$notification?.warning({ title: '请先选择预算方案', duration: 2500 })
  }
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
function handleDelete(index: number) {
  tableData.value.splice(index, 1)
}
function removeTable() {
  tableData.value = []
}
// 获取编码
async function fetchCode() {
  const res = await budgetCompileListApi.fetchCode({ type: 2, assetId: Data.mainData.assetId ?? '' })
  // options.branchOptions = res.data
  if (res.code === 200)
    Data.mainData.compileCode = res.data
}

async function fetchDept(val: number | undefined) {
  if (!val)
    return
  const res = await baseApi.getSelectAssetUser({ assetId: val })
  formatDrop(res.data)
  options.deptOptions = res.data
}

interface ColumnList {
  columns: DataTableColumns<RowData>
  columnNos: DataTableColumns<RowData>
}
const columnList: ColumnList = reactive({
  columns: [
    { type: 'selection' },
    {
      title: '预算科目',
      align: 'center',
      width: 120,
      key: 'budSubOptions',
      render(row, index) {
        return [
          h(
            NCascader,
            {
              labelField: 'budSubjectName',
              valueField: 'budSubjectId',
              value: row.budSubjectId,
              options: options.budSubOptions,

              checkStrategy: 'child',
              async onUpdateValue(v) {
                tableData.value[index].budSubjectId = v
              },
            },
          ),
        ]
      },
    },
    {
      title: '预算事项明细',
      key: 'matter',
      align: 'center',
      width: 100,
      ellipsis: { tooltip: true },
      render(row, index) {
        return [
          h(
            NInput, {
              style: {
                width: '10000px',
              },
              value: row.matter,
              onUpdateValue(v) {
                tableData.value[index].matter = v
              },
            },
          ),
        ]
      },
    },
    {
      title: '合同编号',
      key: 'contractNumber',
      align: 'center',
      width: 100,
      ellipsis: { tooltip: true },
      render(row, index) {
        return [
          h(
            NInput, {
              style: {
                width: '10000px',
              },
              value: row.contractNumber,
              onUpdateValue(v) {
                tableData.value[index].contractNumber = v
              },

            },
          ),
        ]
      },
    },
    {
      title: '签约单位',
      key: 'signingUnit',
      align: 'center',
      width: 100,

      ellipsis: { tooltip: true },
      render(row, index) {
        return [
          h(
            NInput, {
              style: {
                width: '10000px',
              },
              value: row.signingUnit,
              onUpdateValue(v) {
                tableData.value[index].signingUnit = v
              },

            },
          ),
        ]
      },
    },
    {
      title: '合同金额',
      key: 'contractAmount',
      align: 'center',
      width: 80,

      ellipsis: { tooltip: true },
      render(row, index) {
        return [
          h(
            NInput, {
              style: {
                width: '10000px',
              },
              value: row.contractAmount,
              onUpdateValue(v) {
                tableData.value[index].contractAmount = v
              },

            },
          ),
        ]
      },
    },
    {
      title: '应结算金额',
      key: 'shouldPayAmount',
      align: 'center',
      width: 80,

      ellipsis: { tooltip: true },
      render(row, index) {
        return [
          h(
            NInput, {
              style: {
                width: '10000px',
              },
              value: row.shouldPayAmount,
              onUpdateValue(v) {
                tableData.value[index].shouldPayAmount = v
              },

            },
          ),
        ]
      },
    },
    {
      title: '已付金额',
      key: 'paidAmount',
      align: 'center',
      width: 80,

      ellipsis: { tooltip: true },
      render(row, index) {
        return [
          h(
            NInput, {
              style: {
                width: '10000px',
              },
              value: row.paidAmount,
              onUpdateValue(v) {
                tableData.value[index].paidAmount = v
              },

            },
          ),
        ]
      },
    },
    {
      title: '未付金额',
      key: 'unpaidAmount',
      align: 'center',
      width: 80,

      ellipsis: { tooltip: true },
      render(row, index) {
        return [
          h(
            NInput, {
              style: {
                width: '10000px',
              },
              value: row.unpaidAmount,
              onUpdateValue(v) {
                tableData.value[index].unpaidAmount = v
              },

            },
          ),
        ]
      },
    },
    {
      title: '本年预计付款金额',
      key: 'baseNumber',
      align: 'center',
      width: 80,
      ellipsis: { tooltip: true },
      render(row, index) {
        return [
          h(
            NInputNumber, {
              value: row.baseNumber,
              showButton: false,
              disabled: true,

            },

          ),
        ]
      },
    },
    {
      title: '操作',
      key: 'actions',
      width: 90,
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
          h(
            NButton,
            {
              size: 'small',
              type: 'error',
              style: {
                marginLeft: '10px',
              },
              onClick: () => handleDelete(index),
            },
            { icon: renderIcon('material-symbols:delete-outline', { size: 14 }) },
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
      key: 'budSubOptions',
      render(row, index) {
        return [
          h(
            NCascader,
            {
              labelField: 'budSubjectName',
              valueField: 'budSubjectId',
              value: row.budSubjectId,
              options: options.budSubOptions,

              checkStrategy: 'child',
              async onUpdateValue(v) {
                tableData.value[index].budSubjectId = v
              },
            },
          ),
        ]
      },
    },
    {
      title: '预算事项明细',
      key: 'matter',
      align: 'center',
      width: 100,
      ellipsis: { tooltip: true },
      render(row, index) {
        return [
          h(
            NInput, {
              style: {
                width: '10000px',
              },
              value: row.matter,
              onUpdateValue(v) {
                tableData.value[index].matter = v
              },
            },
          ),
        ]
      },
    },
    {
      title: '本年预计收款金额',
      key: 'baseNumber',
      align: 'center',
      width: 80,
      ellipsis: { tooltip: true },
      render(row, index) {
        return [
          h(
            NInputNumber, {
              value: row.baseNumber,
              showButton: false,
              disabled: true,
            },

          ),
        ]
      },
    },
    {
      title: '操作',
      key: 'actions',
      width: 90,
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
          h(
            NButton,
            {
              size: 'small',
              type: 'error',
              style: {
                marginLeft: '10px',
              },
              onClick: () => handleDelete(index),
            },
            { icon: renderIcon('material-symbols:delete-outline', { size: 14 }) },
          ),
        ]
      },
    },
  ],
})

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
// 子组件修改预算期间基准数
function updataTable({ data, baseNumber }) {
  Data.mainData.budCompileList![Data.keyIndex].budCompileDataList = data
  Data.mainData.budCompileList![Data.keyIndex].baseNumber = baseNumber
}

function updataUploadTable(table) {
  Data.mainData.budCompileList![Data.fileIndex].urlList = table
}
async function fetchBaseData() {
  await fetchCode()
  await fetchDept(Data.mainData.assetId)
}

onMounted(() => {
  instance?.proxy?.$Bus.on('editHandle', async (row: any) => {
    // 新增
    if (row.type) {
      loading.value = true
      const res = await budgetCompileListApi.getBudCompileDataList({ name: '新增', compileCode: '' })
      if (res.code === 200)
        loading.value = false
      Data.modalVisible = !Data.modalVisible
      Data.mainData = {
        contractState: 2,
      }
      Data.editData = {}
      tableData.value = []
      Data.mainData.budCompileList = tableData.value
      Data.mainData.preparationName = res.data.budCompileList[0].preparationName
      Data.mainData.createdName = res.data.budCompileList[0].createdName
      Data.mainData.modifiedName = res.data.budCompileList[0].modifiedName
      Data.mainData.preparationId = res.data.budCompileList[0].preparationId
      Data.mainData.createdId = res.data.budCompileList[0].createdId
      Data.mainData.modifiedId = res.data.budCompileList[0].modifiedId
      fetchCode()

      options.budSubOptions = baseApiListStore.budAccountInfo
    }
    // 编辑
    else {
      loading.value = true
      const res = await budgetCompileListApi.getBudCompileDataList({ name: '编辑', compileCode: row.compileCode })
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
        changeBudPro()
        options.budSubOptions = baseApiListStore.budAccountInfo

        // fetchBranch()
      }
      else {
        window.$notification?.warning({ title: `${res.message}`, duration: 2500 })
      }
    }
    options.assetOptions = baseApiListStore.assetUserInfo
    options.branchOptions = baseApiListStore.branchUserInfo
    options.budProOptions = baseApiListStore.budProgrammeInfo

    changeColumnTitle()
  })
})

watch(() => Data.showAdjust, (val, old) => {
  Data.showAdjust = val
})

watch(() => Data.showModal, (val, old) => {
  Data.showModal = val
})
</script>

<template>
  <n-modal
    v-model:show="Data.modalVisible" class="custom-card" preset="card"
    :title="`预算调整${JSON.stringify(Data.editData) === '{}' ? '录入' : '编辑'}`" size="huge"
  >
    <n-card title="基本数据">
      <n-form
        ref="formRef" label-placement="top" :model="Data.mainData" label-width="auto" require-mark-placement="left"
        :rules="rules"
      >
        <n-grid :cols="24" :x-gap="24">
          <n-form-item-gi label="预算编制代码" span="6" path="compileCode">
            <NInput v-model:value="Data.mainData.compileCode" :disabled="JSON.stringify(Data.editData) !== '{}'" clearable placeholder="请输入" @blur="keyCheck" />
          </n-form-item-gi>
          <n-form-item-gi label="预算事项" span="18" path="compileName">
            <NInput v-model:value="Data.mainData.compileName" clearable placeholder="请输入" maxlength="20" />
          </n-form-item-gi>
          <n-form-item-gi label="产权结构" span="6" path="assetId">
            <NSelect
              v-model:value="Data.mainData.assetId" :disabled="JSON.stringify(Data.editData) !== '{}'" label-field="assetName" value-field="assetId" filterable
              :options="options.assetOptions" placeholder="请选择" clearable
              @update:value="fetchBaseData"
            />
          </n-form-item-gi>
          <n-form-item-gi label="管理结构" span="6" path="branchId">
            <NSelect
              v-model:value="Data.mainData.branchId" clearable filterable :options="options.branchOptions"
              label-field="branchName" value-field="branchId" placeholder="请选择"
            />
          </n-form-item-gi>
          <n-form-item-gi label="部门" span="6" path="deptId">
            <NCascader
              v-model:value="Data.mainData.deptId" label-field="deptName" value-field="deptId" filterable
              :options="options.deptOptions" placeholder="请选择" clearable :disabled="!Data.mainData.assetId"
            />
          </n-form-item-gi>
          <n-form-item-gi label="预算方案" path="budProgrammeId" span="6">
            <NSelect
              v-model:value="Data.mainData.budProgrammeId" label-field="name" value-field="id" filterable
              :options="options.budProOptions" placeholder="请选择" clearable
              @update:value="changeBudPro"
            />
          </n-form-item-gi>
          <n-form-item-gi label="预算类型" span="6" path="feeType">
            <NSelect
              v-model:value="Data.mainData.feeType" label-field="feeTypeName" clearable filterable
              value-field="feeType" :options="options.feeTypeOptions" placeholder="请选择" span="6"
              @update:value="changeColumnTitle"
            />
          </n-form-item-gi>
          <n-form-item-gi label="是否合同" span="6" path="contractState">
            <NSelect
              v-model:value="Data.mainData.contractState" clearable filterable
              :options="options.contractStateOptions" label-field="contractStateName" value-field="contractState"
              placeholder="请选择" @update:value="removeTable"
            />
          </n-form-item-gi>
          <n-form-item-gi label="立项名称" span="6" path="projectName">
            <NInput v-model:value="Data.mainData.projectName" clearable placeholder="请输入" />
          </n-form-item-gi>
          <n-form-item-gi label="编制日期" span="6" path="preparationTime">
            <n-date-picker
              v-model:formatted-value="Data.mainData.preparationTime" value-format="yyyy-MM-dd" type="date"
              clearable placeholder="请输入" :style="{ width: '100%' }"
            />
          </n-form-item-gi>
          <n-form-item-gi label="编制说明" span="24" path="preparationDescription">
            <NInput
              v-model:value="Data.mainData.preparationDescription" type="textarea" :autosize="{
                minRows: 2,
              }" :style="{ width: '100%' }" clearable placeholder="请输入"
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
        <n-space m-auto>
          <NButton type="primary" @click="handleAdd">
            <template #icon>
              <!-- <icon-icon-park-outline:return /> -->
            </template>
            添加一行
          </NButton>
        </n-space>
      </n-layout-header>
      <n-data-table
        mt-10 default-expand-all single-column striped
        :columns="(Data.mainData.contractState === -1 || Data.mainData.contractState === 0) ? columnList.columns : columnList.columnNos"
        :row-key="(row: RowData) => row.id" :data="tableData" :loading="loading"
        :scroll-x="(Data.mainData.contractState === -1 || Data.mainData.contractState === 0) ? 2300 : 900"
      />
    </n-card>
    <n-card title="人员数据" mt-10>
      <n-layout flex-height>
        <n-form inline :label-width="80" :model="Data.mainData">
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
        <NButton type="info" mr-10 @click="editMsg">
          保存
        </NButton>
        <NButton type="info" ml-10 @click="Data.modalVisible = false">
          取消
        </NButton>
      </NLayout>
    </template>
  </n-modal>

  <detailList
    v-model:showModal="Data.showModal"
    v-model:bud-pro-options="options.budProOptions"
    @updata-table="updataTable"
  />

  <adjust
    v-model:show-adjust="Data.showAdjust"
    :file-edit-index="Data.fileEditIndex"
    :upload-table="uploadTable"
    :bud-pro-options="options.budProOptions"
    @updata-upload-table="updataUploadTable"
  />
</template>

<style scoped>
:deep(div.n-cascader-submenu--virtual .n-cascader-submenu) {
  width: 250px !important;
}
</style>

