<script setup lang="ts">
import type { DataTableColumns } from 'naive-ui'
import { NButton, NTag } from 'naive-ui'
import type { budgetProgramTable } from './interface'
import { budgetProgramApi } from '@/api/budgetApi'
import { isNullOrUndef, renderIcon, showBtn } from '@/utils/common'
import { useAppStore } from '@/store'
const props = defineProps<{
  buttons: string[]
  metaLength: number
  metaTitleLength: number
}>()
const appStore = useAppStore()
const tHeight = ref(appStore.tHeight - 320 + (props.metaTitleLength === 0 ? 42 : 0))

const columns: DataTableColumns<budgetProgramTable.RowData> = [
  { type: 'selection' },
  {
    title: '序号',
    align: 'center',
    width: 80,
    key: 'key',
    render: (_, index) => {
      return `${index + 1}`
    },
  },
  {
    title: '在编状态',
    key: 'editStatusName',
    align: 'center',
    width: 80,
    ellipsis: { tooltip: true },
    render(row) {
      return [
        h(
          NTag,
          {
            type: 'warning',
            style: {
              paddingLeft: '20px',
              paddingRight: '20px',
            },
          },
          { default: () => row.editStatusName },
        ),
      ]
    },
  },
  {
    title: '执行状态',
    key: 'executeStatusName',
    align: 'center',
    width: 80,
    ellipsis: { tooltip: true },
    render(row) {
      return [
        h(
          NTag,
          {

            type: 'warning',
            style: {
              paddingLeft: '20px',
              paddingRight: '20px',
            },
          },
          { default: () => row.executeStatusName },
        ),
      ]
    },
  },
  { title: '方案名称', key: 'name', align: 'center', width: 280, ellipsis: { tooltip: true } },
  { title: '方案类型', key: 'typeName', align: 'center', width: 80, ellipsis: { tooltip: true } },
  { title: '制定日期', key: 'formulateDate', align: 'center', width: 100, ellipsis: { tooltip: true } },
  { title: '起始年份', key: 'beginYear', align: 'center', width: 80, ellipsis: { tooltip: true } },
  { title: '起始期间', key: 'beginPeriod', align: 'center', width: 80, ellipsis: { tooltip: true } },
  { title: '结束年份', key: 'endYear', align: 'center', width: 80, ellipsis: { tooltip: true } },
  { title: '结束期间', key: 'endPeriod', align: 'center', width: 80, ellipsis: { tooltip: true } },
  { title: '滚动预算', key: 'scrollBudgetName', align: 'center', width: 80, ellipsis: { tooltip: true } },
  { title: '是否历史数据', key: 'historyName', align: 'center', width: 120, ellipsis: { tooltip: true } },
  {
    title: '操作',
    key: 'actions',
    width: props.metaLength === 0 ? 80 : 100 * props.metaLength,
    align: 'center',
    fixed: 'right',
    render(row) {
      return [
        h(
          NButton,
          {
            size: 'small',
            type: 'warning',
            hidden: !showBtn('执行', props.buttons),
            style: {
              marginLeft: '2px',
              marginRight: '2px',
            },
            onClick: () => handleProEdit(row, false),
          },
          { default: () => '执行', icon: renderIcon('material-symbols:not-started-outline', { size: 14 }) },
        ),
        h(
          NButton,
          {
            size: 'small',
            type: 'info',
            hidden: !showBtn('编辑', props.buttons),
            style: {
              marginLeft: '2px',
              marginRight: '2px',
            },
            onClick: () => handleEdit(row),
          },
          { default: () => '编辑', icon: renderIcon('material-symbols:edit', { size: 14 }) },
        ),
        h(
          NButton,
          {
            size: 'small',
            type: 'error',
            style: {
              marginLeft: '2px',
              marginRight: '2px',
            },
            hidden: !showBtn('删除', props.buttons),
            onClick: () => handleDelete(row),
          },
          { default: () => '删除', icon: renderIcon('material-symbols:delete-outline', { size: 14 }) },
        ),
      ]
    },
  },
]
const loading = ref<boolean>(false)
const tableData = ref()
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
})
const instance = getCurrentInstance()
// search 页面触发
instance?.proxy?.$Bus.on('search', (searchValue: any) => {
  Data.page.pageNum = 1
  Data.params = { ...searchValue }
  initTableData()
})
// edit 页面触发
instance?.proxy?.$Bus.on('fetchData', () => {
  initTableData()
})

// 初始化数据
async function initTableData() {
  loading.value = true
  try {
    Data.params.pageNum = Data.page.pageNum
    Data.params.pageSize = Data.page.pageSize
    const res = await budgetProgramApi.getBudProList(Data.params)
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
async function handleDelete(row: budgetProgramTable.RowData) {
  if (isNullOrUndef(row.id))
    return
  window.$dialog?.warning({
    title: '确认删除？',
    negativeText: '取消',
    positiveText: '确认',
    onPositiveClick: async () => {
      const res = await budgetProgramApi.removeBudProgrammer({ id: row.id })
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
function handleEdit(row: budgetProgramTable.RowData) {
  instance?.proxy?.$Bus.emit('edit', row)
}
// 执行
function handleProEdit(row: budgetProgramTable.RowData, type: boolean) {
  if (isNullOrUndef(row.id))
    return
  if (type) {
    window.$dialog?.warning({
      title: '是否修改编制状态',
      negativeText: '取消',
      positiveText: '确认',
      onPositiveClick: async () => {
        const res = await budgetProgramApi.saveEditBudProgrammer({ id: row.id, editStatus: row.editStatus === 0 ? 1 : 0 })
        if (res.code === 200) {
          window.$message?.success('修改成功')
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
      title: '是否修改执行状态',
      negativeText: '取消',
      positiveText: '确认',
      onPositiveClick: async () => {
        const res = await budgetProgramApi.saveEditBudProgrammer({ id: row.id, executeStatus: row.executeStatus === 0 ? 1 : 0 })
        if (res.code === 200) {
          window.$message?.success('修改成功')
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
  <n-data-table
    single-column striped :columns="columns" :row-key="(row: budgetProgramTable.RowData) => row.id" :data="tableData"
    :loading="loading" :scroll-x="1300 + 100 * props.metaLength" flex-height :style="{ minHeight: `${tHeight}px` }"
  />
  <n-pagination
    v-model:page="Data.page.pageNum" v-model:page-size="Data.page.pageSize"
    :page-count="Data.page.totalPage" size="large" show-quick-jumper show-size-picker :page-sizes="[10, 20, 50, 100]"
    :on-update:page="pageChange" :on-update:page-size="pageSizeChange" f-r-r mt-10
  />
</template>

