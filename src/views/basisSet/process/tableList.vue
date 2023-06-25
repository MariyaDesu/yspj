<script setup lang="ts">
import type { DataTableColumns } from 'naive-ui'
import { NButton } from 'naive-ui'
import { processApi } from '@/api/basisSetApi'
import { isNullOrUndef, renderIcon, showBtn } from '@/utils/common'
import { useAppStore } from '@/store'
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
  processId: string
  enable: string
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
  { title: '编码', key: 'processCode', align: 'center', width: 80, ellipsis: { tooltip: true } },
  { title: '流程名称', key: 'processName', align: 'center', width: 200, ellipsis: { tooltip: true } },
  { title: '单据类型', key: 'billTypeName', align: 'center', width: 120, ellipsis: { tooltip: true } },
  {
    title: '启用状态',
    key: 'enable',

    align: 'center',
    width: 80,
    ellipsis: { tooltip: true },
    render(row) {
      return row.enable ? '启用' : '不启用'
    },
  },
  { title: '创建人', key: 'createdName', align: 'center', width: 120, ellipsis: { tooltip: true } },
  {
    title: '创建时间',
    key: 'createdTime',

    width: 150,
    align: 'center',
    ellipsis: { tooltip: true },
  },
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
              marginRight: '10px',
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
            onClick: () => handleDelete(row),
          },
          { default: () => '删除', icon: renderIcon('material-symbols:delete-outline', { size: 14 }) },
        ),
      ]
    },
  },
]

const paginationReactive = reactive({
  page: 1,
  pageSize: 10,
  showSizePicker: true,
  pageSizes: [10, 50, 100],
  onChange: (page: number) => {
    paginationReactive.page = page
  },
  onUpdatePageSize: (pageSize: number) => {
    paginationReactive.pageSize = pageSize
    paginationReactive.page = 1
  },
})

const loading = ref<boolean>(false)
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
const tableData = ref([])
const instance = getCurrentInstance()
instance?.proxy?.$Bus.on('search', (searchValue: any) => {
  Data.page.pageNum = 1
  Data.params = { ...searchValue }
  initTableData()
})
instance?.proxy?.$Bus.on('fetchProcessTableData', () => {
  initTableData()
})
onMounted(() => {
  initTableData()
})
async function initTableData() {
  loading.value = true
  try {
    Data.params.pageNum = Data.page.pageNum
    Data.params.pageSize = Data.page.pageSize
    const res = await processApi.getProcessList(Data.params)
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
function pageChange(val: any) {
  Data.page.pageNum = val
  initTableData()
}
function pageSizeChange(val: any) {
  Data.page.pageNum = 1
  Data.page.pageSize = val
  initTableData()
}
async function handleDelete(row: RowData) {
  if (isNullOrUndef(row.processId))
    return
  window.$dialog?.warning({
    title: '确认删除？',
    negativeText: '取消',
    positiveText: '确认',
    onPositiveClick: async () => {
      const res = await processApi.removeProcess([row.processId])
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
    single-column
    striped
    :columns="columns" :row-key="(row:RowData) => row.deptId" :data="tableData"
    :loading="loading" flex-height
    :style="{ minHeight: `${tHeight}px` }"
    :scroll-x="1000 + 100 * props.metaLength"
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

