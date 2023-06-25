<script setup lang="ts">
import type { DataTableColumns } from 'naive-ui'
import { NButton } from 'naive-ui'
import { deptManagementApi } from '@/api/basisSetApi'
import { renderIcon, showBtn } from '@/utils/common'
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
  deptId: string
  deptName: string
  branchName: string
  supDept: string
}

const columns: DataTableColumns<RowData> = [
  { type: 'selection' },
  {
    title: '序号',
    align: 'center',
    width: 60,
    minWidth: 60,
    key: 'key',
    render: (_, index) => {
      return `${index + 1}`
    },
  },
  { title: '部门编码', key: 'deptCode', align: 'center', width: 100, ellipsis: { tooltip: true } },
  { title: '部门名称', key: 'deptName', align: 'center', width: 120, ellipsis: { tooltip: true } },
  { title: '产权结构', key: 'assetName', align: 'center', width: 200, ellipsis: { tooltip: true } },
  { title: '上级部门', key: 'supDeptName', align: 'center', width: 120, ellipsis: { tooltip: true } },
  { title: '创建人', key: 'createdUserName', align: 'center', width: 80, ellipsis: { tooltip: true } },
  { title: '创建时间', key: 'modifiedDate', align: 'center', width: 150, ellipsis: { tooltip: true } },
  {
    title: '操作',
    key: 'actions',
    width: props.metaLength === 0 ? 100 : 100 * props.metaLength,
    align: 'center',
    fixed: 'right',
    render(row) {
      return [
        h(
          NButton,
          {
            size: 'small',
            type: 'info',
            style: {
              marginLeft: '2px',
              marginRight: '2px',
            },
            hidden: !showBtn('编辑', props.buttons),
            onClick: () => handleEdit(row),
          },
          { default: () => '编辑', icon: renderIcon('material-symbols:edit', { size: 14 }) },
        ),
        h(
          NButton,
          {
            size: 'small',
            type: 'error',
            hidden: !showBtn('删除', props.buttons),
            style: {
              marginLeft: '2px',
              marginRight: '2px',
            },
            onClick: () => handleDelete(row),
          },
          { default: () => '删除', icon: renderIcon('material-symbols:delete-outline', { size: 14 }) },
        ),
      ]
    },
  },
]

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

const loading = ref<boolean>(false)

const tableData = ref([])
const instance = getCurrentInstance()
instance?.proxy?.$Bus.on('search', (searchValue: any) => {
  Data.page.pageNum = 1
  Data.params = { ...searchValue }
  initTableData()
})
instance?.proxy?.$Bus.on('delete', async () => {
  await handleDelete(Data.checkedRowKeys)
})
instance?.proxy?.$Bus.on('fetchData', () => {
  initTableData()
})

instance?.proxy?.$Bus.on('exportsExcel', () => {
  exportsExcel()
})

// 导出
function exportData(arr) {
  const fields = [
    '部门名称',
    '产权结构',
    '上级部门',
    '创建人',
    '创建时间',

  ]
  const filterVal = [
    'deptName',
    'assetName',
    'supDeptName',
    'createdUserName',
    'modifiedDate',
  ]

  const data = arr.map(v => filterVal.map(j => v[j]))
  Export(data, fields, '部门')
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
          const res = await deptManagementApi.getDeptManagementList(params)
          arr = res.data.list
          exportData(arr)
          window.$message?.success('导出成功')
        },
        onNegativeClick: () => {
          window.$message?.success('已取消')
        },
      })
    }
    else {
      tableData.value.forEach((item: any) => {
        Data.checkedRowKeys.forEach((itemChildren: any) => {
          if (itemChildren === item.deptId)
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
// 初始化数据
async function initTableData() {
  loading.value = true
  try {
    Data.params.pageNum = Data.page.pageNum
    Data.params.pageSize = Data.page.pageSize
    const res = await deptManagementApi.getDeptManagementList(Data.params)
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
async function handleDelete(row) {
  const params = row.deptId ? [row.deptId] : row
  window.$dialog?.warning({
    title: '确认删除？',
    negativeText: '取消',
    positiveText: '确认',
    onPositiveClick: async () => {
      const res = await deptManagementApi.removeDept(params)
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
    v-model:checked-row-keys="Data.checkedRowKeys"
    :columns="columns" :row-key="(row:RowData) => row.deptId" :data="tableData"
    :loading="loading" flex-height
    :style="{ minHeight: `${tHeight}px` }"
    striped
    :scroll-x="1200 + 100 * props.metaLength"
  />
  <n-pagination
    v-model:page="Data.page.pageNum" v-model:page-size="Data.page.pageSize" :page-count="Data.page.totalPage"
    size="large"
    show-quick-jumper
    show-size-picker
    :page-sizes="[10, 20, 50, 100]"
    :on-update:page="pageChange"
    :on-update:page-size="pageSizeChange"
    f-r-r mt-10
  />
</template>

