<script setup lang="ts">
import type { DataTableColumns } from 'naive-ui'
import { sysLogApi } from '@/api/sysManaApi'

import { useAppStore } from '@/store'
const appStore = useAppStore()
const tHeight = ref(appStore.tHeight - 310)
interface RowData {
  id: number
  btype: number
  logId: number
  operaName: string
  operation: string
  operaDate: string

}
const columns: DataTableColumns<RowData> = [
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

  { title: '操作人名字', key: 'operaName', align: 'center', width: 100, ellipsis: { tooltip: true } },
  {
    title: '操作类型',
    key: 'btype',
    align: 'center',
    width: 100,
    ellipsis: { tooltip: true },
    render(row) {
      return row.btype === 0 ? '菜单' : row.btype === 1 ? '角色' : row.btype === 2 ? '用户' : row.btype === 3 ? '职位' : row.btype === 4 ? '部门' : row.btype === 5 ? '管理结构' : row.btype === 6 ? '流程' : row.btype === 7 ? '产权 ' : '无数据'
    },
  },
  { title: '操作记录', key: 'operation', align: 'center', width: 100, ellipsis: { tooltip: true } },
  { title: '操作时间', key: 'operaDate', align: 'center', width: 100, ellipsis: { tooltip: true } },
]
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
async function initTableData() {
  loading.value = true
  try {
    Data.params.pageNum = Data.page.pageNum
    Data.params.pageSize = Data.page.pageSize
    const res = await sysLogApi.basLogList(Data.params)
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
</script>

<template>
  <n-data-table
    single-column striped :columns="columns"
    :row-key="(row:RowData) => row.logId" :data="tableData" :loading="loading"
    :scroll-x="1000" flex-height :style="{ minHeight: `${tHeight}px` }"
    default-expand-all
  />
  <n-pagination
    v-model:page="Data.page.pageNum" v-model:page-size="Data.page.pageSize" :page-count="Data.page.totalPage"
    size="large"
    show-quick-jumper
    show-size-picker
    :page-sizes="[10, 20, 50, 100]"
    :on-update:page="pageChange"
    :on-update:page-size="pageSizeChange"
    f-r-r
  />
</template>

