<script setup lang="ts">
import type { DataTableColumns } from 'naive-ui'
import { NButton } from 'naive-ui'
import { sysDutyApi } from '@/api/sysManaApi'
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
  userId: string
  dutyId: string
  enable: boolean
  enableName: string

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

  { title: '审批角色编码', key: 'dutyCode', align: 'center', width: 100, ellipsis: { tooltip: true } },
  { title: '审批角色名称', key: 'dutyName', align: 'center', width: 100, ellipsis: { tooltip: true } },
  { title: '排序', key: 'sort', align: 'center', width: 80, ellipsis: { tooltip: true } },
  { title: '状态', key: 'enableName', align: 'center', width: 80, ellipsis: { tooltip: true } },

  { title: '创建人', key: 'createdUserName', align: 'center', width: 120, ellipsis: { tooltip: true } },
  {
    title: '创建时间',
    key: 'createdDate',

    width: 150,
    align: 'center',
    ellipsis: { tooltip: true },
  },
  // { title: '排序', key: 'sort', align: 'center', width: 120, ellipsis: { tooltip: true } },

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
const tableData = ref([])
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
instance?.proxy?.$Bus.on('delete', async () => {
  await handleDelete(Data.checkedRowKeys)
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
instance?.proxy?.$Bus.on('exportsExcel', () => {
  exportsExcel()
})

// 导出
function exportData(arr) {
  const fields = [
    '审批角色名称',
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
  Export(data, fields, '审批角色')
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

async function handleDelete(row) {
  const params = row.dutyId ? [row.dutyId] : row
  window.$dialog?.warning({
    title: '确认删除？',
    negativeText: '取消',
    positiveText: '确认',
    onPositiveClick: async () => {
      const res = await sysDutyApi.removeDuty(params)
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
</script>

<template>
  <n-data-table
    v-model:checked-row-keys="Data.checkedRowKeys"
    single-column striped :columns="columns"
    :row-key="(row:RowData) => row.dutyId" :data="tableData" :loading="loading"
    :scroll-x="800 + 100 * props.metaLength" flex-height :style="{ minHeight: `${tHeight}px` }"
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
    f-r-r mt-10
  />
</template>

