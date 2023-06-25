<script setup lang="ts">
import type { DataTableColumns } from 'naive-ui'
// import { NButton } from 'naive-ui'
import { sysDutyApi } from '@/api/sysManaApi'
// import { isNullOrUndef, renderIcon, showBtn, showBtnLength } from '@/utils/common'
import { useAppStore } from '@/store'

import { Export } from '@/vendor/Export2Excel.js'
const appStore = useAppStore()
const tHeight = ref(appStore.tHeight - 310)
// const router = useRouter()
// const { currentRoute } = router
// interface CurrentRouteMetaList {
//   currentRouteMeta: any
// }
// const currentRouteMetaList: CurrentRouteMetaList = reactive({
//   currentRouteMeta: currentRoute.value.meta,
// })
// const arrMeta = ['编辑', '删除']
// const metaList = showBtnLength(arrMeta, currentRouteMetaList.currentRouteMeta.buttons)
interface RowData {
  baseId: number
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

  { title: '基础资料名称', key: 'baseName', align: 'center', width: 300, ellipsis: { tooltip: true } },
]
const loading = ref<boolean>(false)
const tableData = ref([
  {
    baseId: 1,
    baseName: '管理结构初始化',
  },
  {
    baseId: 2,
    baseName: '产权结构初始化',
  },
  {
    baseId: 3,
    baseName: '部门管理初始化',
  },
  {
    baseId: 4,
    baseName: '角色管理初始化',
  },
  {
    baseId: 5,
    baseName: '职位管理初始化',
  },
  {
    baseId: 6,
    baseName: '用户管理初始化',
  },
  {
    baseId: 7,
    baseName: '用户分配审批角色管理初始化资料',
  },
  {
    baseId: 8,
    baseName: '预算科目初始化',
  },
  {
    baseId: 9,
    baseName: '会计科目初始化',
  },
  {
    baseId: 10,
    baseName: '科目匹配初始化',
  },
])
const Data = reactive({
  checkedRowKeys: [],
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
  // initTableData()
})
instance?.proxy?.$Bus.on('exportsExcel', () => {
  exportsExcel()
})

instance?.proxy?.$Bus.on('checkedRowKeysHandle', () => {
  instance?.proxy?.$Bus.emit('sendCheckedRowKeysHandle', Data.checkedRowKeys)
})

// 导出
function exportData(arr) {
  const fields = [
    '职位名称',
    '排序',
    '状态',
    '创建人',
    '创建时间',
  ]
  const filterVal = [
    'dutyName',
    'sort',
    'enableName',
    'createdUserName',
    'createdDate',
  ]

  const data = arr.map(v => filterVal.map(j => v[j]))
  Export(data, fields, '职位')
}
async function exportsExcel() {
  try {
    instance?.proxy?.$Bus.emit('loading', true)
    // Data.isExport = true
    let arr: any = []
    if (Data.checkedRowKeys.length === 0) {
      window.$dialog?.warning({
        title: '确认导出全部？',
        negativeText: '取消',
        positiveText: '确认',
        onPositiveClick: async () => {
          const params = {}
          const res = await sysDutyApi.getSysDutyList(params)
          arr = res.data.list
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
      tableData.value.forEach((item: any) => {
        Data.checkedRowKeys.forEach((itemChildren: any) => {
          if (itemChildren === item.dutyId)
            arr.push(item)
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

async function initTableData() {
  loading.value = true
  try {
    Data.params.pageNum = Data.page.pageNum
    Data.params.pageSize = Data.page.pageSize
    const res = await sysDutyApi.getSysDutyList(Data.params)
    if (res.code === 200) {
      // tableData.value = res.data.list
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
    v-model:checked-row-keys="Data.checkedRowKeys"
    single-column striped :columns="columns"
    :row-key="(row:RowData) => row.baseId" :data="tableData" :loading="loading"
    flex-height :style="{ minHeight: `${tHeight}px` }"
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

