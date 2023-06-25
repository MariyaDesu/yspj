<script setup lang="ts">
import { NButton, NDropdown } from 'naive-ui'
import Export from '@/vendor/Export.js'
import { budgetCompileListAlterApi, budgetCompileListApi } from '@/api/budgetApi'
import { isNullOrUndef, renderIcon, showBtn } from '@/utils/common'
import { useAppStore, useBaseApiListStore } from '@/store'

const props = defineProps<{
  buttons: string[]
  metaLength: number
  metaTitleLength: number
}>()
const baseApiListStore: any = useBaseApiListStore()
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
  adjustState: number
  projectNameList: Array<any>
  status?: number
  steps: Array<any>
}
const xTable = ref()
const loading = ref<boolean>(false)
const tableData = ref([])
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

onMounted(() => {
  initTableData()
})

instance?.proxy?.$Bus.on('exportsExcel', () => {
  exportsExcel()
})

instance?.proxy?.$Bus.on('exportsExcelNo', () => {
  exportsExcelNo()
})

const fields = reactive([
  '预算编制代码',
  '预算事项',
  '末级科目代码',
  '末级科目名称',
  '预算方案代码',
  '预算方案名称',
  '预算事项',
  '预算年份',
  '预算期间',
  '预算期间基准数',
  '是否历史数据',
  '调整后预算数',
])

const unfields = reactive([
  '预算编制代码',
  '预算事项',
  '末级科目代码',
  '末级科目名称',
  '预算方案代码',
  '预算方案名称',
  '预算事项',
])

const filterVal = reactive([
  'compileCode',
  'compileName',
  'budSubjectCode',
  'budSubjectName',
  'budProgrammeCode',
  'budProgrammeName',
  'matter',
  'budYear',
  'budPeriod',
  'baseNumbers',
  'ifHistory',
  'amountAdjustment',
])

const unfilterVal = reactive([
  'compileCode',
  'compileName',
  'budSubjectCode',
  'budSubjectName',
  'budProgrammeCode',
  'budProgrammeName',
  'matter',
])

function exportData(arr) {
  const data = arr.map(v => filterVal.map(j => v[j]))
  Export(data, fields, '预算编制调整')
}

function exportDataNo(arr) {
  const data = arr.map(v => unfilterVal.map(j => v[j]))
  Export(data, unfields, '预算编制调整')
}

// 导出
async function exportsExcel() {
  try {
    instance?.proxy?.$Bus.emit('loading', true)
    // Data.isExport = true
    const arr: any = []
    if (xTable.value.getCheckboxRecords().length === 0) {
      window.$dialog?.warning({
        title: '确认导出全部？',
        negativeText: '取消',
        positiveText: '确认',
        onPositiveClick: async () => {
          const params = {}
          const res = await budgetCompileListAlterApi.getBudCompileAlterList(params)
          res.data.list.forEach((item: any) => {
            item.budCompileListForExportd.forEach((itemChildren: any, index) => {
              itemChildren.budCompileDataListForExportd.forEach((itemChildrenList, index) => {
                if (index === 0) {
                  itemChildren.budYear = itemChildrenList.budYear
                  itemChildren.budPeriod = itemChildrenList.budPeriod
                  itemChildren.baseNumbers = itemChildrenList.baseNumber
                  itemChildren.ifHistory = itemChildrenList.ifHistory
                  itemChildren.amountAdjustment = itemChildrenList.amountAdjustment
                  if (itemChildrenList.adjustmentNumberList.length > 0) {
                    itemChildrenList.adjustmentNumberList.forEach((items, indexs) => {
                      fields.push(`第${items.serialNumber}次调整`)
                      filterVal.push(`afterMoney${indexs}`)
                      itemChildren[`afterMoney${indexs}`] = items.afterMoney
                    })
                  }
                  arr.push(itemChildren)
                }
                else {
                  arr.push({
                    budYear: itemChildrenList.budYear,
                    budPeriod: itemChildrenList.budPeriod,
                    baseNumbers: itemChildrenList.baseNumber,
                    ifHistory: itemChildrenList.ifHistory,
                    amountAdjustment: itemChildrenList.amountAdjustment,
                  })
                  if (itemChildrenList.adjustmentNumberList.length > 0) {
                    itemChildrenList.adjustmentNumberList.forEach((items, indexs) => {
                      arr[index][`afterMoney${indexs}`] = items.afterMoney
                    })
                  }
                }
              })
            })
          })
          exportData(arr)
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
        item.budCompileListForExportd.forEach((itemChildren: any, index) => {
          itemChildren.budCompileDataListForExportd.forEach((itemChildrenList, index) => {
            if (index === 0) {
              itemChildren.budYear = itemChildrenList.budYear
              itemChildren.budPeriod = itemChildrenList.budPeriod
              itemChildren.baseNumbers = itemChildrenList.baseNumber
              itemChildren.ifHistory = itemChildrenList.ifHistory
              itemChildren.amountAdjustment = itemChildrenList.amountAdjustment
              if (itemChildrenList.adjustmentNumberList.length > 0) {
                itemChildrenList.adjustmentNumberList.forEach((items, indexs) => {
                  fields.push(`第${items.serialNumber}次调整`)
                  filterVal.push(`afterMoney${indexs}`)
                  itemChildren[`afterMoney${indexs}`] = items.afterMoney
                })
              }

              arr.push(itemChildren)
            }
            else {
              arr.push({
                budYear: itemChildrenList.budYear,
                budPeriod: itemChildrenList.budPeriod,
                baseNumbers: itemChildrenList.baseNumber,
                ifHistory: itemChildrenList.ifHistory,
                amountAdjustment: itemChildrenList.amountAdjustment,
              })
              if (itemChildrenList.adjustmentNumberList.length > 0) {
                itemChildrenList.adjustmentNumberList.forEach((items, indexs) => {
                  arr[index][`afterMoney${indexs}`] = items.afterMoney
                })
              }
            }
          })
        })
      })
      exportData(arr)
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
    const arr: any = []
    if (xTable.value.getCheckboxRecords().length === 0) {
      window.$dialog?.warning({
        title: '确认导出全部？',
        negativeText: '取消',
        positiveText: '确认',
        onPositiveClick: async () => {
          const params = {

          }
          const res = await budgetCompileListAlterApi.getBudCompileAlterList(params)
          res.data.list.forEach((item: any) => {
            item.budCompileListForExportd.forEach((itemChildren: any, index) => {
              arr.push(itemChildren)
            })
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
        item.budCompileListForExportd.forEach((itemChildren: any, index) => {
          arr.push(itemChildren)
        })
      })
      exportDataNo(arr)
      window.$message?.success('导出成功')
    }

    instance?.proxy?.$Bus.emit('loading', false)
  }
  catch (error) {
    console.error(error)
  }
}
async function initTableData() {
  loading.value = true
  try {
    Data.params.pageNum = Data.page.pageNum
    Data.params.pageSize = Data.page.pageSize
    const res = await budgetCompileListAlterApi.getBudCompileAlterList(Data.params)
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
// 调整
function handleEdit(row: RowData) {
  instance?.proxy?.$Bus.emit('edit', row)
}
// 编辑
function handleEditAdjust(row: RowData) {
  instance?.proxy?.$Bus.emit('editHandle', row)
}
// 查看详情
function handleTableEdit(row: RowData) {
  instance?.proxy?.$Bus.emit('changeBudComplieAlterTableEdit', row)
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
// 保存
async function handleSubmit(row: RowData) {
  if (isNullOrUndef(row.id))
    return
  if (row.adjustState === 0 || row.adjustState === 6) {
    window.$dialog?.warning({
      title: '确认保存？',
      negativeText: '取消',
      positiveText: '确认',
      onPositiveClick: async () => {
        const res = await budgetCompileListAlterApi.saveAddBudCompileListAlterEdit({ compileCode: row.compileCode, adjustState: 1 })
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
        const res = await budgetCompileListAlterApi.saveAddBudCompileListAlterEdit({ compileCode: row.compileCode, adjustState: 7 })
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
// 批量提交流程
instance?.proxy?.$Bus.on('submitProessList', async () => {
  if (xTable.value.getCheckboxRecords().length === 0)
    return
  const key: any = []
  for (let i = 0; i < xTable.value.getCheckboxRecords().length; i++)
    key.push({ compileId: xTable.value.getCheckboxRecords()[i].id, assetId: xTable.value.getCheckboxRecords()[i].assetId, deptId: xTable.value.getCheckboxRecords()[i].deptId, billTypeId: 1, processId: xTable.value.getCheckboxRecords()[i].processId })

  const res = await budgetCompileListAlterApi.submitProessList(key)
  if (res.code === 200)
    window.$message?.success(`${res.data}`)

  else
    window.$message?.error(`${res.message}`)

  initTableData()
})
// 批量保存
instance?.proxy?.$Bus.on('submitList', async () => {
  // 判断是否有勾选
  if (xTable.value.getCheckboxRecords().length === 0)
    return
  const key: any = []
  for (let i = 0; i < xTable.value.getCheckboxRecords().length; i++)
    key.push(xTable.value.getCheckboxRecords()[i].compileCode)
  const res = await budgetCompileListAlterApi.submitList({ compileCodeList: key, adjustState: 1 })
  if (res.code === 200) {
    window.$message?.success(`${res.data}`)
    initTableData()
  }

  else { window.$message?.error(`${res.message}`) }
})
// 流程详情
async function handleSubmitProcess(row: RowData) {
  const res = await budgetCompileListApi.getAutoProcessList({ compileId: row.id, assetId: row.assetId, deptId: row.deptId, billTypeId: 2 })
  if (res.code === 200) {
    const result = { id: row.id, assetId: row.assetId, deptId: row.deptId, compileName: row.compileName, assetName: row.assetName, deptName: row.deptName, data: res.data }
    nextTick(() => {
      instance?.proxy?.$Bus.emit('process', result)
    })
  }
  else {
    window.$message?.error(`${res.message}`)
  }
}
// 按钮组选项
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
      show: showBtn('撤回', props.buttons) && (row.adjustState !== 0 && row.adjustState !== 6) && baseApiListStore.timeInfo.canUpdate === 1,
    },
    {
      label: () => h(NButton, {
        size: 'small',
        type: 'success',
      },
      { default: () => '保存', icon: renderIcon('material-symbols:arrow-circle-right-outline', { size: 20 }) },
      ),
      key: 'submit',
      show: showBtn('保存', props.buttons) && (row.adjustState === 0 || row.adjustState === 6) && baseApiListStore.timeInfo.canUpdate === 1,
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
        onClick: () => handleTableEdit(row),
      },

    },
    {
      label: () => h(NButton, {
        size: 'small',
        type: 'primary',
      },
      { default: () => '调整', icon: renderIcon('humbleicons:exchange-horizontal', { size: 20 }) },
      ),
      key: 'edit',
      show: showBtn('调整', props.buttons) && baseApiListStore.timeInfo.canUpdate === 1,

      props: {
        onClick: () => handleEdit(row),
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
      show: showBtn('编辑', props.buttons) && baseApiListStore.timeInfo.canUpdate === 1,
      props: {
        onClick: () => handleEditAdjust(row),
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
      show: showBtn('删除', props.buttons) && baseApiListStore.timeInfo.canUpdate === 1,
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
  <vxe-table
    ref="xTable" border :tree-config="{
      indent: 16,
      trigger: 'cell',

    }" :loading="loading" :column-config="{ resizable: true }" :data="tableData" :height="tHeight"
    class="mytable-scrollbar"
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
    <vxe-column field="moneyOne" title="调整前预算数" width="200" />
    <vxe-column field="moneyTwo" title="调整额" width="200" />
    <vxe-column field="moneyThree" title="调整后预算数" width="200" />
    <vxe-column field="moneyFour" title="调整率" width="200">
      <template #default="scope">
        {{ scope.row.moneyFour ? `${scope.row.moneyFour}%` : '-' }}
      </template>
    </vxe-column>
    <!-- <vxe-column field="baseNumberSum" title="总金额" width="200" /> -->
    <vxe-column field="executeStatusName" title="方案状态名称" width="200" />
    <vxe-column field="sadjustStateName" title="状态名称" width="" :min-width="200" />
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
  <n-pagination
    v-model:page="Data.page.pageNum" v-model:page-size="Data.page.pageSize" :page-count="Data.page.totalPage"
    size="large" show-quick-jumper show-size-picker :page-sizes="[10, 20, 50, 100]" :on-update:page="pageChange"
    :on-update:page-size="pageSizeChange" f-r-r mt-10
  />
</template>

