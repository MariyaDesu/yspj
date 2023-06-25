<script setup lang="ts">
import type { DataTableColumns } from 'naive-ui'
import { NButton, NDataTable, NDropdown } from 'naive-ui'
import { budgetApprovalListApi, budgetCompileListApi } from '@/api/budgetApi'
import { isNullOrUndef, renderIcon, showBtn } from '@/utils/common'
import { useAppStore } from '@/store'
import { Export } from '@/vendor/Export2Excel.js'
const props = defineProps<{
  buttons: string[]
  metaLength: number
  metaTitleLength: number
}>()
const appStore = useAppStore()
const tHeight = ref(appStore.tHeight - 320 + (props.metaTitleLength === 0 ? 42 : 0))
interface RowData {
  id: string
  instanceId: string
  budSubjectId: string
  compileCode: string
  compileId: string
  assetId: string
  deptId: string
  deptName: string
  compileName: string
  assetName: string
  state: number
  projectNameList: Array<any>
  status?: number
  steps: Array<any>
}

interface IHistoryRowData {
  nodeName: string
  executeName: string
  executeTime: string
  auditInfo: string
}

const historyColumn: DataTableColumns<IHistoryRowData> = [
  { title: '', key: '', align: 'center', width: 67, ellipsis: { tooltip: true } },
  {
    title: '序号',
    align: 'center',
    width: 80,
    key: 'key',
    render: (_, index) => {
      return `${index + 1}`
    },
  },
  { title: '审批节点名称', key: 'nodeName', align: 'center', width: 150, ellipsis: { tooltip: true } },
  { title: '审批人', key: 'executeName', align: 'center', width: 80, ellipsis: { tooltip: true } },
  { title: '审批时间', key: 'executeTime', align: 'center', width: 150, ellipsis: { tooltip: true } },
  { title: '审批意见', key: 'auditInfo', align: 'center', width: 300, ellipsis: { tooltip: true } },
  { title: '', key: '', align: 'center', width: '', ellipsis: { tooltip: true } },
]

const historyColumns: DataTableColumns<RowData> = [
  { type: 'selection' },
  {
    type: 'expand',
    renderExpand: (row, index) => {
      return [
        h(
          NDataTable, {
            columns: historyColumn,
            data: row.steps,
          },
        ),
      ]
    },
  },
  {
    title: '序号',
    align: 'center',
    width: 80,
    key: 'key',
    render: (_, index) => {
      return `${index + 1}`
    },
  },

  { title: '预算编制编码', key: 'compileCode', align: 'center', width: 250, ellipsis: { tooltip: true } },
  { title: '预算编制名称', key: 'compileName', align: 'center', width: 250, ellipsis: { tooltip: true } },
  { title: '单据类型名称', key: 'billTypeName', align: 'center', width: 250, ellipsis: { tooltip: true } },
  { title: '预算事项', key: 'compileName', align: 'center', width: 300, ellipsis: { tooltip: true } },
  { title: '流程名称', key: 'processName', align: 'center', width: 250, ellipsis: { tooltip: true } },
  {
    title: '流程执行状态',
    key: 'status',
    align: 'center',
    width: 250,
    ellipsis: { tooltip: true },
    render(row) {
      return row.status === 0 ? '审批中' : row.status === 1 ? '未通过' : row.status === 2 ? '已完结' : ''
    },
  },
  { title: '编制人', key: 'linkmanName', align: 'center', width: 250, ellipsis: { tooltip: true } },
  { title: '备注', key: 'memo', align: 'center', width: 250, ellipsis: { tooltip: true } },
  { title: '创建时间', key: 'createdTime', align: 'center', width: 250, ellipsis: { tooltip: true } },
]
const xTable = ref()
const loading = ref<boolean>(false)
const tableData = ref([])
const historyTableData = ref([])

const Data = reactive({
  page: {
    pageNum: 1,
    pageSize: 10,
    totalPage: 0,
  },
  params: {
    pageNum: 0,
    pageSize: 0,
  },
  modalVisible: false,
  id: '',
  processId: '',
  processOptions: [],
})
const instance = getCurrentInstance()
instance?.proxy?.$Bus.on('search', (searchValue: any) => {
  Data.page.pageNum = 1
  Data.params = { ...searchValue }
  initTableData()
})
instance?.proxy?.$Bus.on('fetchData', () => {
  initTableData()
})

instance?.proxy?.$Bus.on('submitList', async () => {
  if (xTable.value.getCheckboxRecords().length === 0)
    return
  const key: any = []
  for (let i = 0; i < xTable.value.getCheckboxRecords().length; i++)
    key.push(xTable.value.getCheckboxRecords()[i].compileCode)
  const res = await budgetCompileListApi.submitList({ compileCodeList: key, state: 1 })
  if (res.code === 200)
    window.$message?.success(`${res.data}`)

  else
    window.$message?.error(`${res.message}`)

  initTableData()
})

instance?.proxy?.$Bus.on('submitProessList', async () => {
  if (xTable.value.getCheckboxRecords().length === 0)
    return
  const key: any = []

  for (let i = 0; i < xTable.value.getCheckboxRecords().length; i++)
    key.push({ compileId: xTable.value.getCheckboxRecords()[i].id, assetId: xTable.value.getCheckboxRecords()[i].assetId, deptId: xTable.value.getCheckboxRecords()[i].deptId, billTypeId: 2, processId: xTable.value.getCheckboxRecords()[i].processId })

  const res = await budgetCompileListApi.submitProessList(key)
  if (res.code === 200)
    window.$message?.success(`${res.data}`)

  else
    window.$message?.error(`${res.message}`)

  initTableData()
})

instance?.proxy?.$Bus.on('exportsExcel', () => {
  exportsExcel()
})
instance?.proxy?.$Bus.on('exportsExcelNo', () => {
  exportsExcelNo()
})
// 带明细导出配置
function exportData(arr, arr1) {
  const hasfields = [
    '*预算编制代码',
    '*状态名称',
    '*预算事项',
    '*产权结构名称',
    '*管理结构名称',
    '*部门名称',
    '*预算方案名称',
    '预算类型',
    '是否合同',
    '总金额',
    '立项名称',
    '编制日期',
    '编制说明',
    '预算科目编码',
    '预算事项明细',
    '合同编号',
    '签约单位',
    '合同金额',
    '应结算金额',
    '已付金额',
    '未付金额',
    '本年预计付款金额',
    '1月',
    '2月',
    '3月',
    '4月',
    '5月',
    '6月',
    '7月',
    '8月',
    '9月',
    '10月',
    '11月',
    '12月',
    '创建人名称',
    '编制人名称',
    '编辑人名称',
  ]
  const unhasfields = [
    '*预算编制代码',
    '*状态名称',
    '*预算事项',
    '*产权结构名称',
    '*管理结构名称',
    '*部门名称',
    '*预算方案名称',
    '预算类型',
    '是否合同',
    '总金额',
    '立项名称',
    '编制日期',
    '编制说明',
    '预算科目编码',
    '预算事项明细',
    '本年预计收款金额',
    '1月',
    '2月',
    '3月',
    '4月',
    '5月',
    '6月',
    '7月',
    '8月',
    '9月',
    '10月',
    '11月',
    '12月',
    '创建人名称',
    '编制人名称',
    '编辑人名称',
  ]
  const hasfilterVal = [
    'compileCode',
    'stateName',
    'compileName',
    'assetName',
    'branchName',
    'deptName',
    'budProgrammeName',
    'feeTypeName',
    'contractStateName',
    'baseNumber',
    'projectName',
    'preparationTime',
    'preparationDescription',
    'codeAndName',
    'matter',
    'contractNumber',
    'signingUnit',
    'contractAmount',
    'shouldPayAmount',
    'paidAmount',
    'unpaidAmount',
    'baseNumbers',
    'oneNum',
    'twoNum',
    'threeNum',
    'fourNum',
    'fiveNum',
    'sixNum',
    'sevenNum',
    'eightNum',
    'nineNum',
    'tenNum',
    'elevenNum',
    'twelveNum',
    'modifiedName',
    'modifiedNames',
    'preparationName',

  ]
  const unhasfilterVal = [
    'compileCode',
    'stateName',
    'compileName',
    'assetName',
    'branchName',
    'deptName',
    'budProgrammeName',
    'feeTypeName',
    'contractStateName',
    'baseNumber',
    'projectName',
    'preparationTime',
    'preparationDescription',
    'codeAndName',
    'matter',
    'baseNumbers',
    'oneNum',
    'twoNum',
    'threeNum',
    'fourNum',
    'fiveNum',
    'sixNum',
    'sevenNum',
    'eightNum',
    'nineNum',
    'tenNum',
    'elevenNum',
    'twelveNum',
    'modifiedName',
    'modifiedNames',
    'preparationName',

  ]
  const thead = [
    '基本数据',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '预算数据',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
  ]
  const hasdata = arr.map(v => hasfilterVal.map(j => v[j]))
  const unhasdata = arr1.map(v => unhasfilterVal.map(j => v[j]))
  // Export(data, fields, '有合同')
  // Export(data1, fields1, '无合同')
  const result: any = []
  result.push({
    sheetTitle: '有合同',
    th: hasfields,
    thead,
    data: hasdata,
  }, {
    sheetTitle: '无合同',
    th: unhasfields,
    thead,
    data: unhasdata,
  })

  Export(result, '预算录入')
}
// 不带明细导出配置
function exportDataNo(arr, arr1) {
  const hasfields = [
    '*预算编制代码',
    '*状态名称',
    '*预算事项',
    '*产权结构名称',
    '*管理结构名称',
    '*部门名称',
    '*预算方案名称',
    '预算类型',
    '是否合同',
    '总金额',
    '立项名称',
    '编制日期',
    '编制说明',
    '预算科目编码',
    '预算事项明细',
    '合同编号',
    '签约单位',
    '合同金额',
    '应结算金额',
    '已付金额',
    '未付金额',
    '本年预计付款金额',
    '1月',
    '2月',
    '3月',
    '4月',
    '5月',
    '6月',
    '7月',
    '8月',
    '9月',
    '10月',
    '11月',
    '12月',
    '创建人名称',
    '编制人名称',
    '编辑人名称',
  ]
  const unhasfields = [
    '*预算编制代码',
    '*状态名称',
    '*预算事项',
    '*产权结构名称',
    '*管理结构名称',
    '*部门名称',
    '*预算方案名称',
    '预算类型',
    '是否合同',
    '总金额',
    '立项名称',
    '编制日期',
    '编制说明',
    '预算科目编码',
    '预算事项明细',
    '本年预计收款金额',
    '1月',
    '2月',
    '3月',
    '4月',
    '5月',
    '6月',
    '7月',
    '8月',
    '9月',
    '10月',
    '11月',
    '12月',
    '创建人名称',
    '编制人名称',
    '编辑人名称',
  ]
  const hasfilterVal = [
    'compileCode',
    'stateName',
    'compileName',
    'assetName',
    'branchName',
    'deptName',
    'budProgrammeName',
    'feeTypeName',
    'contractStateName',
    'baseNumber',
    'projectName',
    'preparationTime',
    'preparationDescription',
    'codeAndName',
    'matter',
    'contractNumber',
    'signingUnit',
    'contractAmount',
    'shouldPayAmount',
    'paidAmount',
    'unpaidAmount',
    'baseNumber',
    'oneNum',
    'twoNum',
    'threeNum',
    'fourNum',
    'fiveNum',
    'sixNum',
    'sevenNum',
    'eightNum',
    'nineNum',
    'tenNum',
    'elevenNum',
    'twelveNum',
    'modifiedName',
    'modifiedName',
    'preparationName',

  ]
  const unhasfilterVal = [
    'compileCode',
    'stateName',
    'compileName',
    'assetName',
    'branchName',
    'deptName',
    'budProgrammeName',
    'feeTypeName',
    'contractStateName',
    'baseNumber',
    'projectName',
    'preparationTime',
    'preparationDescription',
    'codeAndName',
    'matter',
    'baseNumber',
    'oneNum',
    'twoNum',
    'threeNum',
    'fourNum',
    'fiveNum',
    'sixNum',
    'sevenNum',
    'eightNum',
    'nineNum',
    'tenNum',
    'elevenNum',
    'twelveNum',
    'modifiedName',
    'modifiedName',
    'preparationName',

  ]
  const thead = [
    '基本数据',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '预算数据',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
  ]
  const hasdata = arr.map(v => hasfilterVal.map(j => v[j]))
  const unhasdata = arr1.map(v => unhasfilterVal.map(j => v[j]))

  interface Sheet {
    sheetTitle: string
    th: string[]
    thead: string[]
    data: string[]
  }
  const result: Sheet[] = []
  result.push({
    sheetTitle: '有合同',
    th: hasfields,
    thead,
    data: hasdata,
  }, {
    sheetTitle: '无合同',
    th: unhasfields,
    thead,
    data: unhasdata,
  })

  Export(result, '预算录入')
}
// 按钮组
function btnoptions(row) {
  return [
    {
      label: () => h(NButton,
        {
          size: 'small',
          type: 'error',
          onClick: () => handleSubmit(row),
        },
        { default: () => '撤回', icon: renderIcon('material-symbols:arrow-circle-right-outline', { size: 20 }) }),
      key: 'return',
      show: showBtn('撤回', props.buttons) && row.state !== 0,
    },
    {
      label: () => h(NButton, {
        size: 'small',
        type: 'success',
      },
      { default: () => '保存', icon: renderIcon('material-symbols:arrow-circle-right-outline', { size: 20 }) },
      ),
      key: 'submit',
      show: showBtn('保存', props.buttons) && row.state === 0,
      props: {
        onClick: () => handleSubmit(row),
      },
    },
    {
      label: () => h(NButton, {
        size: 'small',
        type: 'warning',
      },
      { default: () => '查看详情', icon: renderIcon('bx:message-rounded-detail', { size: 20 }) },
      ),
      key: 'check',
      show: showBtn('查看详情', props.buttons),
      props: {
        onClick: () => handleDetail(row),
      },

    },
    {
      label: () => h(NButton, {
        size: 'small',
        type: 'info',
      },
      { default: () => '编辑', icon: renderIcon('material-symbols:edit', { size: 20 }) },
      ),
      key: 'edit',
      show: showBtn('编辑', props.buttons),
      props: {
        onClick: () => handleEdit(row),
      },
    },
    {
      label: () => h(NButton, {
        size: 'small',
        type: 'primary',
      },
      { default: () => '删除', icon: renderIcon('material-symbols:delete-outline', { size: 20 }) },
      ),
      key: 'delete',
      show: showBtn('删除', props.buttons),
      props: {
        onClick: () => handleDelete(row),
      },
    },
    {
      label: () => h(NButton, {
        size: 'small',
        type: 'success',
      },
      { default: () => '流程详情', icon: renderIcon('ic:outline-view-list', { size: 20 }) },
      ),
      key: 'detail',
      show: showBtn('流程详情', props.buttons),
      props: {
        onClick: () => handleSubmitProcess(row),
      },

    },
    {
      label: () => h(NButton, {
        size: 'small',
        type: 'success',
      },
      { default: () => '历史流程', icon: renderIcon('ic:outline-view-list', { size: 20 }) },
      ),
      key: 'history',
      show: showBtn('历史流程', props.buttons),
      props: {
        onClick: () => handleHistoryProcess(row),
      },

    },
  ]
}

// 导出
async function exportsExcel() {
  try {
    instance?.proxy?.$Bus.emit('loading', true)
    // Data.isExport = true
    const hasArr: any = []
    const unHasArr: any = []
    if (xTable.value.getCheckboxRecords().length === 0) {
      window.$dialog?.warning({
        title: '确认导出全部？',
        negativeText: '取消',
        positiveText: '确认',
        onPositiveClick: async () => {
          const params = {}
          loading.value = true
          const res = await budgetCompileListApi.getBudCompileList(params)
          res.data.list.forEach((item: any) => {
            item.budCompileListForExportd.forEach((itemChildren: any, index) => {
              if (itemChildren.contractState === 0 || itemChildren.contractState === -1) {
                let list = {}
                if (index === 0) {
                  list = {
                    compileCode: itemChildren.compileCode,
                    stateName: itemChildren.stateName,
                    compileName: itemChildren.compileName,
                    assetName: itemChildren.assetName,
                    branchName: itemChildren.branchName,
                    deptName: itemChildren.deptName,
                    budProgrammeName: itemChildren.budProgrammeName,
                    feeTypeName: itemChildren.feeTypeName,
                    contractStateName: itemChildren.contractStateName,
                    baseNumber: itemChildren.baseNumber,
                    projectName: itemChildren.projectName,
                    preparationTim: itemChildren.preparationTim,
                    preparationDescription: itemChildren.preparationDescription,
                    codeAndName: itemChildren.codeAndName,
                    matter: itemChildren.matter,
                    contractNumber: itemChildren.contractNumber,
                    signingUnit: itemChildren.signingUnit,
                    contractAmount: itemChildren.contractAmount,
                    shouldPayAmount: itemChildren.shouldPayAmount,
                    paidAmount: itemChildren.paidAmount,
                    unpaidAmount: itemChildren.unpaidAmount,
                    baseNumbers: itemChildren.baseNumber,
                    oneNum: itemChildren.oneNum,
                    twoNum: itemChildren.twoNum,
                    threeNum: itemChildren.threeNum,
                    fourNum: itemChildren.fourNum,
                    fiveNum: itemChildren.fiveNum,
                    sixNum: itemChildren.sixNum,
                    sevenNum: itemChildren.sevenNum,
                    eightNum: itemChildren.eightNum,
                    nineNum: itemChildren.nineNum,
                    tenNum: itemChildren.tenNum,
                    elevenNum: itemChildren.elevenNum,
                    twelveNum: itemChildren.twelveNum,
                    modifiedName: itemChildren.modifiedName,
                    modifiedNames: itemChildren.modifiedName,
                    preparationName: itemChildren.preparationName,
                  }
                }
                else {
                  list = {
                    codeAndName: itemChildren.codeAndName,
                    matter: itemChildren.matter,
                    contractNumber: itemChildren.contractNumber,
                    signingUnit: itemChildren.signingUnit,
                    contractAmount: itemChildren.contractAmount,
                    shouldPayAmount: itemChildren.shouldPayAmount,
                    paidAmount: itemChildren.paidAmount,
                    unpaidAmount: itemChildren.unpaidAmount,
                    baseNumbers: itemChildren.baseNumber,
                    oneNum: itemChildren.oneNum,
                    twoNum: itemChildren.twoNum,
                    threeNum: itemChildren.threeNum,
                    fourNum: itemChildren.fourNum,
                    fiveNum: itemChildren.fiveNum,
                    sixNum: itemChildren.sixNum,
                    sevenNum: itemChildren.sevenNum,
                    eightNum: itemChildren.eightNum,
                    nineNum: itemChildren.nineNum,
                    tenNum: itemChildren.tenNum,
                    elevenNum: itemChildren.elevenNum,
                    twelveNum: itemChildren.twelveNum,
                    modifiedName: itemChildren.modifiedName,
                    modifiedNames: itemChildren.modifiedName,
                    preparationName: itemChildren.preparationName,
                  }
                }

                hasArr.push(list)
              }

              else if (itemChildren.contractState === 1 || itemChildren.contractState === 2) {
                let list = {}
                if (index === 0) {
                  list = {
                    compileCode: itemChildren.compileCode,
                    stateName: itemChildren.stateName,
                    compileName: itemChildren.compileName,
                    assetName: itemChildren.assetName,
                    branchName: itemChildren.branchName,
                    deptName: itemChildren.deptName,
                    budProgrammeName: itemChildren.budProgrammeName,
                    feeTypeName: itemChildren.feeTypeName,
                    contractStateName: itemChildren.contractStateName,
                    baseNumber: itemChildren.baseNumber,
                    projectName: itemChildren.projectName,
                    preparationTim: itemChildren.preparationTim,
                    preparationDescription: itemChildren.preparationDescription,
                    codeAndName: itemChildren.codeAndName,
                    matter: itemChildren.matter,
                    contractNumber: itemChildren.contractNumber,
                    signingUnit: itemChildren.signingUnit,
                    contractAmount: itemChildren.contractAmount,
                    shouldPayAmount: itemChildren.shouldPayAmount,
                    paidAmount: itemChildren.paidAmount,
                    unpaidAmount: itemChildren.unpaidAmount,
                    baseNumbers: itemChildren.baseNumber,
                    oneNum: itemChildren.oneNum,
                    twoNum: itemChildren.twoNum,
                    threeNum: itemChildren.threeNum,
                    fourNum: itemChildren.fourNum,
                    fiveNum: itemChildren.fiveNum,
                    sixNum: itemChildren.sixNum,
                    sevenNum: itemChildren.sevenNum,
                    eightNum: itemChildren.eightNum,
                    nineNum: itemChildren.nineNum,
                    tenNum: itemChildren.tenNum,
                    elevenNum: itemChildren.elevenNum,
                    twelveNum: itemChildren.twelveNum,
                    modifiedName: itemChildren.modifiedName,
                    modifiedNames: itemChildren.modifiedName,
                    preparationName: itemChildren.preparationName,
                  }
                }
                else {
                  list = {
                    codeAndName: itemChildren.codeAndName,
                    matter: itemChildren.matter,
                    contractNumber: itemChildren.contractNumber,
                    signingUnit: itemChildren.signingUnit,
                    contractAmount: itemChildren.contractAmount,
                    shouldPayAmount: itemChildren.shouldPayAmount,
                    paidAmount: itemChildren.paidAmount,
                    unpaidAmount: itemChildren.unpaidAmount,
                    baseNumbers: itemChildren.baseNumber,
                    oneNum: itemChildren.oneNum,
                    twoNum: itemChildren.twoNum,
                    threeNum: itemChildren.threeNum,
                    fourNum: itemChildren.fourNum,
                    fiveNum: itemChildren.fiveNum,
                    sixNum: itemChildren.sixNum,
                    sevenNum: itemChildren.sevenNum,
                    eightNum: itemChildren.eightNum,
                    nineNum: itemChildren.nineNum,
                    tenNum: itemChildren.tenNum,
                    elevenNum: itemChildren.elevenNum,
                    twelveNum: itemChildren.twelveNum,
                    modifiedName: itemChildren.modifiedName,
                    modifiedNames: itemChildren.modifiedName,
                    preparationName: itemChildren.preparationName,
                  }
                }

                unHasArr.push(list)
              }
            })
          })
          exportData(hasArr, unHasArr)
          loading.value = false
          window.$message?.success('导出成功')
        },
        onNegativeClick: () => {
          window.$message?.success('已取消')
        },
      })
    }
    else {
      xTable.value.getCheckboxRecords().forEach((item: { compileCode: string; budCompileListForExportd: string[] }) => {
        item.budCompileListForExportd.forEach((itemChildren: any, index) => {
          if (itemChildren.contractState === 0 || itemChildren.contractState === -1) {
            let list = {}
            if (index === 0) {
              list = {
                compileCode: itemChildren.compileCode,
                stateName: itemChildren.stateName,
                compileName: itemChildren.compileName,
                assetName: itemChildren.assetName,
                branchName: itemChildren.branchName,
                deptName: itemChildren.deptName,
                budProgrammeName: itemChildren.budProgrammeName,
                feeTypeName: itemChildren.feeTypeName,
                contractStateName: itemChildren.contractStateName,
                baseNumber: itemChildren.baseNumber,
                projectName: itemChildren.projectName,
                preparationTim: itemChildren.preparationTim,
                preparationDescription: itemChildren.preparationDescription,
                codeAndName: itemChildren.codeAndName,
                matter: itemChildren.matter,
                contractNumber: itemChildren.contractNumber,
                signingUnit: itemChildren.signingUnit,
                contractAmount: itemChildren.contractAmount,
                shouldPayAmount: itemChildren.shouldPayAmount,
                paidAmount: itemChildren.paidAmount,
                unpaidAmount: itemChildren.unpaidAmount,
                baseNumbers: itemChildren.baseNumber,
                oneNum: itemChildren.oneNum,
                twoNum: itemChildren.twoNum,
                threeNum: itemChildren.threeNum,
                fourNum: itemChildren.fourNum,
                fiveNum: itemChildren.fiveNum,
                sixNum: itemChildren.sixNum,
                sevenNum: itemChildren.sevenNum,
                eightNum: itemChildren.eightNum,
                nineNum: itemChildren.nineNum,
                tenNum: itemChildren.tenNum,
                elevenNum: itemChildren.elevenNum,
                twelveNum: itemChildren.twelveNum,
                modifiedName: itemChildren.modifiedName,
                modifiedNames: itemChildren.modifiedName,
                preparationName: itemChildren.preparationName,
              }
            }
            else {
              list = {
                codeAndName: itemChildren.codeAndName,
                matter: itemChildren.matter,
                contractNumber: itemChildren.contractNumber,
                signingUnit: itemChildren.signingUnit,
                contractAmount: itemChildren.contractAmount,
                shouldPayAmount: itemChildren.shouldPayAmount,
                paidAmount: itemChildren.paidAmount,
                unpaidAmount: itemChildren.unpaidAmount,
                baseNumbers: itemChildren.baseNumber,
                oneNum: itemChildren.oneNum,
                twoNum: itemChildren.twoNum,
                threeNum: itemChildren.threeNum,
                fourNum: itemChildren.fourNum,
                fiveNum: itemChildren.fiveNum,
                sixNum: itemChildren.sixNum,
                sevenNum: itemChildren.sevenNum,
                eightNum: itemChildren.eightNum,
                nineNum: itemChildren.nineNum,
                tenNum: itemChildren.tenNum,
                elevenNum: itemChildren.elevenNum,
                twelveNum: itemChildren.twelveNum,
                modifiedName: itemChildren.modifiedName,
                modifiedNames: itemChildren.modifiedName,
                preparationName: itemChildren.preparationName,
              }
            }

            hasArr.push(list)
          }
          else if (itemChildren.contractState === 1 || itemChildren.contractState === 2) {
            let list = {}
            if (index === 0) {
              list = {
                compileCode: itemChildren.compileCode,
                stateName: itemChildren.stateName,
                compileName: itemChildren.compileName,
                assetName: itemChildren.assetName,
                branchName: itemChildren.branchName,
                deptName: itemChildren.deptName,
                budProgrammeName: itemChildren.budProgrammeName,
                feeTypeName: itemChildren.feeTypeName,
                contractStateName: itemChildren.contractStateName,
                baseNumber: itemChildren.baseNumber,
                projectName: itemChildren.projectName,
                preparationTim: itemChildren.preparationTim,
                preparationDescription: itemChildren.preparationDescription,
                codeAndName: itemChildren.codeAndName,
                matter: itemChildren.matter,
                contractNumber: itemChildren.contractNumber,
                signingUnit: itemChildren.signingUnit,
                contractAmount: itemChildren.contractAmount,
                shouldPayAmount: itemChildren.shouldPayAmount,
                paidAmount: itemChildren.paidAmount,
                unpaidAmount: itemChildren.unpaidAmount,
                baseNumbers: itemChildren.baseNumber,
                oneNum: itemChildren.oneNum,
                twoNum: itemChildren.twoNum,
                threeNum: itemChildren.threeNum,
                fourNum: itemChildren.fourNum,
                fiveNum: itemChildren.fiveNum,
                sixNum: itemChildren.sixNum,
                sevenNum: itemChildren.sevenNum,
                eightNum: itemChildren.eightNum,
                nineNum: itemChildren.nineNum,
                tenNum: itemChildren.tenNum,
                elevenNum: itemChildren.elevenNum,
                twelveNum: itemChildren.twelveNum,
                modifiedName: itemChildren.modifiedName,
                modifiedNames: itemChildren.modifiedName,
                preparationName: itemChildren.preparationName,
              }
            }
            else {
              list = {
                codeAndName: itemChildren.codeAndName,
                matter: itemChildren.matter,
                contractNumber: itemChildren.contractNumber,
                signingUnit: itemChildren.signingUnit,
                contractAmount: itemChildren.contractAmount,
                shouldPayAmount: itemChildren.shouldPayAmount,
                paidAmount: itemChildren.paidAmount,
                unpaidAmount: itemChildren.unpaidAmount,
                baseNumbers: itemChildren.baseNumber,
                oneNum: itemChildren.oneNum,
                twoNum: itemChildren.twoNum,
                threeNum: itemChildren.threeNum,
                fourNum: itemChildren.fourNum,
                fiveNum: itemChildren.fiveNum,
                sixNum: itemChildren.sixNum,
                sevenNum: itemChildren.sevenNum,
                eightNum: itemChildren.eightNum,
                nineNum: itemChildren.nineNum,
                tenNum: itemChildren.tenNum,
                elevenNum: itemChildren.elevenNum,
                twelveNum: itemChildren.twelveNum,
                modifiedName: itemChildren.modifiedName,
                modifiedNames: itemChildren.modifiedName,
                preparationName: itemChildren.preparationName,
              }
            }

            unHasArr.push(list)
          }
        })
      })
      exportData(hasArr, unHasArr)
      window.$message?.success('导出成功')
    }
    instance?.proxy?.$Bus.emit('loading', false)
  }
  catch (error) {
    console.error(error)
  }
}
// 导出
async function exportsExcelNo() {
  try {
    instance?.proxy?.$Bus.emit('loading', true)
    // Data.isExport = true
    const hasArr: any = []
    const unHasArr: any = []
    if (xTable.value.getCheckboxRecords().length === 0) {
      window.$dialog?.warning({
        title: '确认导出全部？',
        negativeText: '取消',
        positiveText: '确认',
        onPositiveClick: async () => {
          const params = {

          }
          loading.value = true
          const res = await budgetCompileListApi.getBudCompileList(params)
          res.data.list.forEach((item: any) => {
            item.budCompileListForExportd.forEach((itemChildren: any, index) => {
              if (itemChildren.contractState === 0 || itemChildren.contractState === -1)
                hasArr.push(itemChildren)

              else if (itemChildren.contractState === 1 || itemChildren.contractState === 2)
                unHasArr.push(itemChildren)
            })
          })
          exportDataNo(hasArr, unHasArr)
          loading.value = false
          window.$message?.success('导出成功')
        },
        onNegativeClick: () => {
          window.$message?.success('已取消')
        },
      })
    }
    else {
      xTable.value.getCheckboxRecords().forEach((item: { compileCode: string; budCompileListForExportd: string[] }) => {
        item.budCompileListForExportd.forEach((itemChildren: any) => {
          if (itemChildren.contractState === 0 || itemChildren.contractState === -1)
            hasArr.push(itemChildren)

          else if (itemChildren.contractState === 1 || itemChildren.contractState === 2)
            unHasArr.push(itemChildren)
        })
      })
      exportData(hasArr, unHasArr)
      window.$message?.success('导出成功')
    }
    instance?.proxy?.$Bus.emit('loading', false)
  }
  catch (error) {
    console.error(error)
  }
}
// 初始化数据
async function initTableData() {
  loading.value = true
  try {
    Data.params.pageNum = Data.page.pageNum
    Data.params.pageSize = Data.page.pageSize
    const res = await budgetCompileListApi.getBudCompileList(Data.params)
    if (res.code === 200) {
      tableData.value = res.data.list
      Data.page.pageNum = res.data.pageNum
      Data.page.pageSize = res.data.pageSize
      Data.page.totalPage = res.data.totalPage
    }
  }
  catch (error) {
    console.error(error)
    tableData.value = []
  }
  loading.value = false
}
// 删除
async function handleDelete(row: RowData) {
  if (isNullOrUndef(row.compileCode))
    return
  window.$dialog?.warning({
    title: '确认删除？',
    negativeText: '取消',
    positiveText: '确认',
    onPositiveClick: async () => {
      const res = await budgetCompileListApi.removeBudCompile({ compileCode: row.compileCode, id: 0 })
      if (res.code === 200) {
        window.$message?.success('删除成功')
        initTableData()
      }
      else {
        window.$message?.error(`${res.message}`)
      }
    },
    onNegativeClick: () => {
      window.$message?.success('已取消')
    },
  })
}
// 编辑
function handleEdit(row: RowData) {
  instance?.proxy?.$Bus.emit('edit', row)
}
// 查看详情
function handleDetail(row: RowData) {
  instance?.proxy?.$Bus.emit('detail', row)
}
//  撤回&提交
async function handleSubmit(row: RowData) {
  if (isNullOrUndef(row.id))
    return
  if (row.state === 0) {
    window.$dialog?.warning({
      title: '确认保存？',
      negativeText: '取消',
      positiveText: '确认',
      onPositiveClick: async () => {
        const res = await budgetCompileListApi.saveEditBudCompileListEdit({ compileCode: row.compileCode, state: 1 })
        if (res.code === 200) {
          window.$message?.success('保存成功,请在流程详情提交执行')
          initTableData()
        }
        else {
          window.$message?.error(`${res.message}`)
        }
      },
      onNegativeClick: () => {
        window.$message?.success('已取消')
      },
    })
  }
  else {
    window.$dialog?.warning({
      title: '确认撤回？',
      negativeText: '取消',
      positiveText: '确认',
      onPositiveClick: async () => {
        const res = await budgetCompileListApi.saveEditBudCompileListEdit({ compileCode: row.compileCode, state: 7 })
        if (res.code === 200) {
          window.$message?.success('撤回成功')
          initTableData()
        }
        else {
          window.$message?.error(`${res.message}`)
        }
      },
      onNegativeClick: () => {
        window.$message?.success('已取消')
      },
    })
  }
}
// 查看流程
async function handleSubmitProcess(row: RowData) {
  const res = await budgetCompileListApi.getAutoProcessList({ compileId: row.id, assetId: row.assetId, deptId: row.deptId, billTypeId: 2 })
  if (res.code === 200) {
    const Dt = { id: row.id, assetId: row.assetId, deptId: row.deptId, compileName: row.compileName, assetName: row.assetName, deptName: row.deptName, data: res.data }
    nextTick(() => {
      instance?.proxy?.$Bus.emit('Process', Dt)
    })
  }
  else {
    window.$message?.error(`${res.message}`)
  }
}
// 查看历史流程
async function handleHistoryProcess(row: RowData) {
  Data.modalVisible = true
  const res = await budgetApprovalListApi.getBudApprovalListList({ compileCode: row.compileCode, compileId: row.id, isHistory: 1 })
  if (res.code === 200)
    historyTableData.value = res.data.list
  else window.$message?.error(`${res.message}`)
}

function pageChange(val) {
  Data.page.pageNum = val
  initTableData()
}
function pageSizeChange(val) {
  Data.page.pageNum = 1
  Data.page.pageSize = val
  initTableData()
}

onMounted(() => {
  initTableData()
})
</script>

<template>
  <vxe-table
    ref="xTable" border :tree-config="{
      indent: 16,
      trigger: 'cell',

    }" :loading="loading" :column-config="{ resizable: true }" :data="tableData" :height="tHeight" class="mytable-scrollbar"
  >
    <vxe-column type="checkbox" width="60" fixed="left" />
    <vxe-column type="expand" title="" width="80" fixed="left">
      <template #content="{ row }">
        <vxe-table
          border :column-config="{ resizable: true }" :tree-config="{
            indent: 16,
            trigger: 'cell',
            expandAll: true,
          }" :data="row.projectNameList"
        >
          <vxe-column type="seq" width="60" title="序号" />
          <vxe-column field="assetName" title="产权结构" width="300" />
          <vxe-column field="branchName" title="管理结构" width="300" />
          <vxe-column field="deptName" title="部门" width="200" />
          <vxe-column field="matter" title="预算事项明细'" width="200" />
          <vxe-column field="codeAndName" title="科目" width="200" />
          <vxe-column field="baseNumber" title="金额" width="200" />
        </vxe-table>
      </template>
    </vxe-column>

    <vxe-column type="seq" width="60" title="序号" />

    <vxe-column field="compileCode" title="预算编号" width="300" />
    <vxe-column field="projectName" title="立项名称" width="300" />
    <vxe-column field="contractStateName" title="有无合同" width="200" />
    <vxe-column field="compileName" title="预算事项" width="200" />
    <vxe-column field="feeTypeName" title="费用类型" width="200" />
    <vxe-column field="baseNumberSum" title="总金额" width="200" />
    <vxe-column field="stateName" title="状态名称" width="" :min-width="200" />
    <vxe-table-column title="操作" width="120" show-overflow align="center" fixed="right">
      <template #default="scope">
        <NDropdown
          trigger="click" :options="btnoptions(scope.row)" show-arrow :loading="loading" :style="{
            marginTop: '20px',
            display: 'flex',
            padding: '10px 0 0',
            backgroundColor: '#f2f2f2',
          }"
        >
          <NButton type="info" size="small">
            按钮组
            <template #icon>
              <icon-ic:sharp-arrow-drop-down />
            </template>
          </NButton>
        </NDropdown>
      </template>
    </vxe-table-column>
  </vxe-table>

  <n-pagination
    v-model:page="Data.page.pageNum" v-model:page-size="Data.page.pageSize" :page-count="Data.page.totalPage"
    size="large" show-quick-jumper show-size-picker :page-sizes="[10, 20, 50, 100]" :on-update:page="pageChange"
    :on-update:page-size="pageSizeChange" f-r-r mt-10
  />
  <n-modal v-model:show="Data.modalVisible" class="custom-card" preset="card" title="历史流程数据" size="huge">
    <NDataTable
      single-column striped :columns="historyColumns" :row-key="(row: RowData) => row.instanceId"
      :data="historyTableData" :loading="loading" :scroll-x="2300" flex-height :style="{ minHeight: `${tHeight}px` }"
    />
  </n-modal>
</template>

