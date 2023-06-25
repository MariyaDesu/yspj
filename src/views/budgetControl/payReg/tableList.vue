<script setup lang="ts">
import { NButton } from 'naive-ui'
import { budgetCompileListApi } from '@/api/budgetApi'
import { adjustApi, payRegApi } from '@/api/budgetControlApi'
import { baseApi } from '@/api/baseApi'
import { isNullOrUndef, renderIcon, showBtn } from '@/utils/common'
import { useAppStore } from '@/store'
import Export from '@/vendor/Export.js'
const props = defineProps<{
  buttons: string[]
  metaLength: number
  metaTitleLength: number
}>()
const appStore = useAppStore()
const tHeight = ref(appStore.tHeight - 360 + (props.metaTitleLength === 0 ? 42 : 0))
interface RowData {
  budControlPayId: number
  budSubjectId: string
  compileCode: string
  compileId: string
  assetId: string
  deptId: string
  deptName: string
  compileName: string
  assetName: string
  budControlPayCode: string
  state: number
  budControlPayList: Array<any>
}

const loading = ref<boolean>(false)
const tableData = ref()
const xTable = ref()
const Data = reactive({
  page: {
    pageNum: 1,
    pageSize: 10,
    totalPage: 0,
  },
  params: {
    pageNum: 0,
    pageSize: 0,
    feeType: 2,
  },
  modalVisible: false,
  id: '',
  processId: '',
  processOptions: [],
  checkedRowKeys: [],
  expand: true,
})

const instance = getCurrentInstance()
instance?.proxy?.$Bus.on('search', (searchValue: any) => {
  Data.page.pageNum = 1
  Data.params = { ...searchValue }
  initTableData()
})

function exportData(arr) {
  const fields = [
    '支付编号',
    '产权结构',
    '银行名称',
    '银行账号',
    '支付总金额',
    '支付方式',
    '支付时间',
    '摘要',
    '管理结构',
    '预算内/外',
    '预算编号',
    '预算事项明细',
    '预算科目',
    '期间时间',
    '支付金额',
    // '手续费',
    // '实际支付金额',

  ]
  const filterVal = [
    'budControlPayCode',
    'assetName',
    'deptName',
    'bankName',
    'bankAccountNumber',
    'budPayMoney',
    'dictValue',
    'payTime',
    'abstracts',
    'branchName',
    'budInOutName',
    'compileCode',
    'matter',
    'codeAndName',
    'periodDate',
    'eachAmount',
    // 'commission',
    // 'actualAmount',
  ]

  const data = arr.map(v => filterVal.map(j => v[j]))
  Export(data, fields, '支付登记')
}

function exportDataNo(arr) {
  const fields = [
    '支付编号',
    '产权结构',
    '部门',
    '银行名称',
    '银行账号',
    '支付总金额',
    '支付方式',
    '支付时间',
    '摘要',
    '管理结构',

  ]
  const filterVal = [
    'budControlPayCode',
    'assetName',
    'deptName',
    'bankName',
    'bankAccountNumber',
    'budPayMoney',
    'dictValue',
    'payTime',
    'abstracts',
    'branchName',
  ]

  const data = arr.map(v => filterVal.map(j => v[j]))
  Export(data, fields, '支付登记')
}
// 导出
async function exportsExcel() {
  try {
    const arr: any = []
    if (xTable.value.getCheckboxRecords().length === 0) {
      window.$dialog?.warning({
        title: '确认导出全部？',
        negativeText: '取消',
        positiveText: '确认',
        onPositiveClick: async () => {
          const params = {
            feeType: 2,
          }
          const res = await payRegApi.getPayRegList(params)
          res.data.list.forEach((item: any) => {
            let list = {}
            if (item.budControlPayList.length === 0) {
              list = {
                budControlPayCode: item.budControlPayCode,
                assetName: item.assetName,
                bankName: item.assetName,
                bankAccountNumber: item.bankAccountNumber,
                budPayMoney: item.budPayMoney,
                dictValue: item.dictValue,
                payTime: item.payTime,
                abstracts: item.abstracts,
                branchName: item.branchName,
              }
              arr.push(list)
            }
            else {
              item.budControlPayList.forEach((itemChildren: any, index) => {
                if (index === 0) {
                  list = {
                    budControlPayCode: item.budControlPayCode,
                    assetName: item.assetName,
                    bankName: item.assetName,
                    bankAccountNumber: item.bankAccountNumber,
                    budPayMoney: item.budPayMoney,
                    dictValue: item.dictValue,
                    payTime: item.payTime,
                    abstracts: item.abstracts,
                    branchName: item.branchName,

                    budInOutName: itemChildren.budInOutName,
                    compileCode: itemChildren.compileCode,
                    matter: itemChildren.matter,
                    codeAndName: itemChildren.codeAndName,
                    periodDate: itemChildren.periodDate,
                    eachAmount: itemChildren.eachAmount,
                  }
                  arr.push(list)
                }
                else {
                  list = {
                    budInOutName: itemChildren.budInOutName,
                    compileCode: itemChildren.compileCode,
                    matter: itemChildren.matter,
                    codeAndName: itemChildren.codeAndName,
                    periodDate: itemChildren.periodDate,
                    eachAmount: itemChildren.eachAmount,
                  }
                  arr.push(list)
                }
              })
            }
          })

          exportData(arr)
          window.$message?.success('导出成功')
        },
        onNegativeClick: () => {
          window.$message?.success('已取消')
        },
      })
    }
    else {
      xTable.value.getCheckboxRecords().forEach((item: any) => {
        item.budControlPayList.forEach((itemChildren: any, index) => {
          let list = {}
          if (item.budControlPayList.length === 0) {
            list = {
              budControlPayCode: item.budControlPayCode,
              assetName: item.assetName,
              bankName: item.assetName,
              bankAccountNumber: item.bankAccountNumber,
              budPayMoney: item.budPayMoney,
              dictValue: item.dictValue,
              payTime: item.payTime,
              abstracts: item.abstracts,
              branchName: item.branchName,

              budInOutName: itemChildren.budInOutName,
              compileCode: itemChildren.compileCode,
              matter: itemChildren.matter,
              codeAndName: itemChildren.codeAndName,
              periodDate: itemChildren.periodDate,
              eachAmount: itemChildren.eachAmount,
            }
          }
          else {
            if (index === 0) {
              list = {
                budControlPayCode: item.budControlPayCode,
                assetName: item.assetName,
                bankName: item.assetName,
                bankAccountNumber: item.bankAccountNumber,
                budPayMoney: item.budPayMoney,
                dictValue: item.dictValue,
                payTime: item.payTime,
                abstracts: item.abstracts,
                branchName: item.branchName,

                budInOutName: itemChildren.budInOutName,
                compileCode: itemChildren.compileCode,
                matter: itemChildren.matter,
                codeAndName: itemChildren.codeAndName,
                periodDate: itemChildren.periodDate,
                eachAmount: itemChildren.eachAmount,
              }
            }
            else {
              list = {
                budInOutName: itemChildren.budInOutName,
                compileCode: itemChildren.compileCode,
                matter: itemChildren.matter,
                codeAndName: itemChildren.codeAndName,
                periodDate: itemChildren.periodDate,
                eachAmount: itemChildren.eachAmount,
              }
            }
          }
          arr.push(list)
        })
      })
      exportData(arr)
      window.$message?.success('导出成功')
    }
  }
  catch (error) {
    console.error(error)
  }
}

// 导出
async function exportsExcelNo() {
  try {
    // Data.isExport = true
    const arr: any = []
    if (xTable.value.getCheckboxRecords().length === 0) {
      window.$dialog?.warning({
        title: '确认导出全部？',
        negativeText: '取消',
        positiveText: '确认',
        onPositiveClick: async () => {
          const params = {
            feeType: 2,
          }
          const res = await payRegApi.getPayRegList(params)
          res.data.list.forEach((item: any, index: number) => {
            // arr.push(item)
            const list = {
              budControlPayCode: item.budControlPayCode,
              assetName: item.assetName,
              bankName: item.assetName,
              bankAccountNumber: item.bankAccountNumber,
              budPayMoney: item.budPayMoney,
              dictValue: item.dictValue,
              payTime: item.payTime,
              abstracts: item.abstracts,
              branchName: item.branchName,
            }

            arr.push(list)

            // console.log(item)
            // item.enabledName = item.enabled ? '已启用' : '未启用'
          })

          exportDataNo(arr)
          window.$message?.success('导出成功')
        },
        onNegativeClick: () => {
          window.$message?.success('已取消')
        },
      })

      // const excel = await import('@/vendor/Export2Excel')
    }
    else {
      xTable.value.getCheckboxRecords().forEach((item: any) => {
        const list = {
          budControlPayCode: item.budControlPayCode,
          assetName: item.assetName,
          bankName: item.assetName,
          bankAccountNumber: item.bankAccountNumber,
          budPayMoney: item.budPayMoney,
          dictValue: item.dictValue,
          payTime: item.payTime,
          abstracts: item.abstracts,
          branchName: item.branchName,
        }

        arr.push(list)
      })
      exportDataNo(arr)
      window.$message?.success('导出成功')
    }

    // excel.export_json_to_excel({
    //   header: tHeader,
    //   data,
    //   filename: '表格',
    //   autoWidth: true,
    //   bookType: 'xlsx',
    // })
  }
  catch (error) {
    console.error(error)
  }
}

function setAllExpand() {
  xTable.value.setAllRowExpand(true)
}
function clearExpand() {
  xTable.value.clearRowExpand()
}
instance?.proxy?.$Bus.on('exportsExcel', () => {
  exportsExcel()
})
instance?.proxy?.$Bus.on('exportsExcelNo', () => {
  exportsExcelNo()
})
instance?.proxy?.$Bus.on('fetchData', () => {
  initTableData()
})
instance?.proxy?.$Bus.on('setAllExpand', () => {
  setAllExpand()
})
instance?.proxy?.$Bus.on('clearExpand', () => {
  clearExpand()
})

onMounted(() => {
  initTableData()
})
async function initTableData() {
  loading.value = true
  try {
    Data.params.pageNum = Data.page.pageNum
    Data.params.pageSize = Data.page.pageSize
    Data.params.feeType = 2
    const res = await payRegApi.getPayRegList(Data.params)
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

async function handleDelete(row: RowData) {
  if (isNullOrUndef(row.budControlPayCode))
    return
  window.$dialog?.warning({
    title: '确认删除？',
    negativeText: '取消',
    positiveText: '确认',
    onPositiveClick: async () => {
      const res = await payRegApi.deleteBudControlPay({ code: row.budControlPayCode })
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

function handleEdit(row: RowData) {
  instance?.proxy?.$Bus.emit('edit', row)
}
async function handleSubmit(row: RowData) {
  if (isNullOrUndef(row.budControlPayId))
    return
  if (row.state === 0) {
    window.$dialog?.warning({
      title: '确认保存？',
      negativeText: '取消',
      positiveText: '确认',
      onPositiveClick: async () => {
        const res = await adjustApi.BudControlPayUpdateState({ code: row.budControlPayCode, state: 1 })
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
        const res = await adjustApi.BudControlPayUpdateState({ code: row.budControlPayCode, state: 0 })
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

async function handleSubmitProcess(row: RowData) {
  const res = await budgetCompileListApi.getAutoProcessList({ compileId: row.budControlPayId, assetId: row.assetId, deptId: row.deptId ?? '', billTypeId: 3 })
  if (res.code === 200) {
    const Dt = { id: row.budControlPayId, assetId: row.assetId, deptId: row.deptId ?? '', compileName: row.compileName, assetName: row.assetName, deptName: row.deptName, data: res.data }
    nextTick(() => {
      instance?.proxy?.$Bus.emit('changeProcessDetails', Dt)
    })
  }
  else {
    window.$message?.error(`${res.message}`)
  }
}
instance?.proxy?.$Bus.on('submitList', async () => {
  if (xTable.value.getCheckboxRecords().length === 0)
    return
  const key: any = []
  for (let i = 0; i < xTable.value.getCheckboxRecords().length; i++)
    key.push(xTable.value.getCheckboxRecords()[i].budControlPayCode)
  const res = await baseApi.budControlPaySubmitList({ codeList: key, state: 1 })
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
    key.push({ compileId: xTable.value.getCheckboxRecords()[i].budControlPayId, assetId: xTable.value.getCheckboxRecords()[i].assetId, deptId: xTable.value.getCheckboxRecords()[i].deptId, billTypeId: 3, processId: xTable.value.getCheckboxRecords()[i].processId })

  const res = await budgetCompileListApi.submitProessList(key)
  if (res.code === 200)
    window.$message?.success(`${res.data}`)

  else
    window.$message?.error(`${res.message}`)

  initTableData()
})
function handleDetail(row: RowData) {
  instance?.proxy?.$Bus.emit('editDetail', row)
}
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
        type: 'warning',
      },
      { default: () => '查看详情', icon: renderIcon('material-symbols:edit', { size: 20 }) },
      ),
      key: 'editDetail',
      show: showBtn('查看详情', props.buttons),
      props: {
        onClick: () => handleDetail(row),
      },
    },
    {
      label: () => h(NButton, {
        size: 'small',
        type: 'error',
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
  ]
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
</script>

<template>
  <vxe-table ref="xTable" border :tree-config="{
    indent: 16,
    trigger: 'cell',

  }" :loading="loading" :column-config="{ resizable: true }" :data="tableData" :height="tHeight"
    class="mytable-scrollbar">
    <vxe-column type="checkbox" width="60" fixed="left" />
    <vxe-column type="expand" title="" width="80" fixed="left">
      <template #content="{ row }">
        <vxe-table border :column-config="{ resizable: true }" :tree-config="{
          indent: 16,
          trigger: 'cell',
          expandAll: true,
        }" :data="row.budControlPayList">
          <vxe-column type="seq" width="60" title="序号" />
          <vxe-column field="budInOutName" title="预算内/外" width="200" />
          <vxe-column field="compileCode" title="预算编码" width="200" />
          <vxe-column field="matter" title="预算事项明细" width="300" />
          <vxe-column field="codeAndName" title="预算科目" width="200" />
          <vxe-column field="eachAmount" title="支付金额" width="200" />
        </vxe-table>
      </template>
    </vxe-column>

    <vxe-column type="seq" width="60" title="序号" />

    <vxe-column field="budControlPayCode" title="支付编号" width="200" />
    <vxe-column field="payTime" title="支付时间" width="200" />
    <vxe-column field="assetName" title="产权结构" width="300" />
    <vxe-column field="deptName" title="部门" width="200" />
    <vxe-column field="budPayMoney" title="支付总金额" width="200" />
    <vxe-column field="bankName" title="银行名称" width="200" />
    <vxe-column field="bankAccountNumber" title="银行账号" width="200" />
    <vxe-column field="dictValue" title="支付方式" width="100" />
    <vxe-column field="abstracts" title="摘要" width="400" />
    <vxe-column field="branchName" title="管理结构" width="200" />
    <vxe-column field="stateName" title="状态" width="" :min-width="200" />
    <vxe-table-column title="操作" width="120" show-overflow align="center" fixed="right">
      <template #default="scope">
        <NDropdown trigger="click" :options="btnoptions(scope.row)" show-arrow :loading="loading" :style="{
          marginTop: '20px',
          display: 'flex',
          padding: '10px 0 0',
          backgroundColor: '#f2f2f2',
        }">
          <NButton type="info" :loading="loading" size="small">
            按钮组
            <template #icon>
              <icon-ic:sharp-arrow-drop-down />
            </template>
          </NButton>
        </NDropdown>
      </template>
    </vxe-table-column>
  </vxe-table>

  <n-pagination v-model:page="Data.page.pageNum" v-model:page-size="Data.page.pageSize" :page-count="Data.page.totalPage"
    size="large" show-quick-jumper show-size-picker :page-sizes="[10, 20, 50, 100]" :on-update:page="pageChange"
    :on-update:page-size="pageSizeChange" f-r-r mt-10 />
</template>

