<script setup lang="ts">
import type { DataTableColumns } from 'naive-ui'
import { NButton } from 'naive-ui'
import { Export } from '@/vendor/Export2Excel.js'
import { sysEquityApi } from '@/api/sysManaApi'
import { renderIcon, showBtn } from '@/utils/common'
import { useAppStore, useBaseApiListStore } from '@/store'
const props = defineProps<{
  buttons: string[]
  metaLength: number
  metaTitleLength: number
}>()
const appStore = useAppStore()
const baseApiListStore = useBaseApiListStore()

const tHeight = ref(appStore.tHeight - 320 + (props.metaTitleLength === 0 ? 42 : 0))
interface RowData {
  assetId: string
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
    key: 'key',
    render: (_, index) => {
      return `${index + 1}`
    },
  },
  { title: '产权结构编码', key: 'assetCode', align: 'center', width: 150, ellipsis: { tooltip: true } },
  { title: '产权结构名称', key: 'assetName', align: 'center', width: 240, ellipsis: { tooltip: true } },
  { title: '产权结构简称', key: 'abbreviation', align: 'center', width: 240, ellipsis: { tooltip: true } },
  { title: '父级产权结构名称', key: 'parentName', align: 'center', width: 240, ellipsis: { tooltip: true } },
  { title: '管理结构名称', key: 'branchName', align: 'center', width: 230, ellipsis: { tooltip: true } },
  { title: '产权类型名称', key: 'assetTypeName', align: 'center', width: 120, ellipsis: { tooltip: true } },
  { title: '法人代表', key: 'legalRepresentative', align: 'center', width: 150, ellipsis: { tooltip: true } },
  { title: '纳税号', key: 'taxNo', align: 'center', width: 180, ellipsis: { tooltip: true } },
  { title: '创建人', key: 'createdUserName', align: 'center', width: 80, ellipsis: { tooltip: true } },
  { title: '创建时间', key: 'createdDate', align: 'center', width: 180, ellipsis: { tooltip: true } },
  {
    title: '操作',
    key: 'actions',
    width: props.metaLength === 0 ? 100 : 110 * props.metaLength,
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
            hidden: !showBtn('编辑审批角色', props.buttons),
            onClick: () => handleEditEquity(row),
          },
          { default: () => '编辑审批角色', icon: renderIcon('material-symbols:edit', { size: 14 }) },
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
  init()
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
    '产权结构编码',
    '产权结构名称',
    '组织机构名称',
    '创建人',
    '创建时间',
  ]
  const filterVal = [
    'assetCode',
    'assetName',
    'branchName',
    'createdUserName',
    'createdDate',
  ]

  const data = arr.map(v => filterVal.map(j => v[j]))
  Export(data, fields, '产权结构')
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
          const res = await sysEquityApi.getSysEquityList(params)
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
          if (itemChildren === item.assetId)
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
    const res = await sysEquityApi.getSysEquityList(Data.params)
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
  const params = row.assetId ? [row.assetId] : row
  window.$dialog?.warning({
    title: '确认删除？',
    negativeText: '取消',
    positiveText: '确认',
    onPositiveClick: async () => {
      const res = await sysEquityApi.removeEquity(params)
      if (res.code === 200) {
        window.$message?.success('删除成功')
        init()
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

function handleEditEquity(row: RowData) {
  instance?.proxy?.$Bus.emit('editTable', row)
}

function init() {
  baseApiListStore.getAssetOptionsList()
  initTableData()
}
</script>

<template>
  <n-data-table
    v-model:checked-row-keys="Data.checkedRowKeys"
    :columns="columns" :row-key="(row:RowData) => row.assetId" :data="tableData"
    :loading="loading" :scroll-x="1800 + 100 * props.metaTitleLength" flex-height
    :style="{ minHeight: `${tHeight}px` }"
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
    mt-10
  />
</template>

