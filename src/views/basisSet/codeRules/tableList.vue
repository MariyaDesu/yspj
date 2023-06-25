<script setup lang="ts">
import type { DataTableColumns } from 'naive-ui'
import { NButton } from 'naive-ui'
import { budCodeSettingApi } from '@/api/basisSetApi'
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
  id: number
  codeSettingId: number
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
  { title: '业务对象类型', key: 'businessObjectTypeName', align: 'center', width: 100, ellipsis: { tooltip: true } },
  { title: '单据代号', key: 'codeName', align: 'center', width: 100, ellipsis: { tooltip: true } },
  { title: '编码方式', key: 'codingTypeName', align: 'center', width: 100, ellipsis: { tooltip: true } },
  { title: '段间分隔符', key: 'separatorsName', align: 'center', width: 100, ellipsis: { tooltip: true } },
  { title: '起始编号', key: 'startCode', align: 'center', width: 100, ellipsis: { tooltip: true } },
  { title: '例子', key: 'example', align: 'center', width: 180, ellipsis: { tooltip: true } },
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
              marginRight: '10px',
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
    const res = await budCodeSettingApi.getbudCodeSettingList(Data.params)
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
  if (isNullOrUndef(row.codeSettingId))
    return
  window.$dialog?.warning({
    title: '确认删除？',
    negativeText: '取消',
    positiveText: '确认',
    onPositiveClick: async () => {
      const res = await budCodeSettingApi.removeBudCodeSetting({ id: row.codeSettingId })
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
    :row-key="(row:RowData) => row.codeSettingId" :data="tableData" :loading="loading"
    :scroll-x="900 + 100 * props.metaLength" flex-height :style="{ minHeight: `${tHeight}px` }"
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

