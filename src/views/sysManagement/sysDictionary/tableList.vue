<script setup lang="ts">
import type { DataTableColumns } from 'naive-ui'
import { NButton } from 'naive-ui'
import { sysDictionaryApi } from '@/api/sysManaApi'
import { renderIcon, showBtn } from '@/utils/common'
import { useAppStore } from '@/store'
const props = defineProps<{
  buttons: string[]
  metaLength: number
  metaTitleLength: number
}>()
const appStore = useAppStore()
const tHeight = ref(appStore.tHeight - 320 + (props.metaTitleLength === 0 ? 42 : 0))
interface RowData {
  code: string
  dictname: string
  enabled: number
  id: number
  remark: string
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
  {
    title: '字典名字',
    key: 'dictname',
    width: 120,
    align: 'center',
    ellipsis: { tooltip: true },
  },
  {
    title: '字典类型编码',
    key: 'code',
    width: 220,
    align: 'center',
    ellipsis: { tooltip: true },
  },
  {
    title: '备注',
    key: 'remark',
    width: 120,
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
            hidden: !showBtn('编辑', props.buttons),
            style: {
              marginLeft: '2px',
              marginRight: '2px',
            },
            onClick: () => handleEdit(row),
          },
          { default: () => '编辑', icon: renderIcon('material-symbols:edit', { size: 14 }) },
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

function handleEdit(row: RowData) {
  instance?.proxy?.$Bus.emit('changeDictionaryEdit', row)
}

instance?.proxy?.$Bus.on('fetchTableData', () => {
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

async function initTableData() {
  loading.value = true
  try {
    Data.params.pageNum = Data.page.pageNum
    Data.params.pageSize = Data.page.pageSize
    const res = await sysDictionaryApi.userCanUpdateList(Data.params)
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

onMounted(() => {
  initTableData()
})
</script>

<template>
  <n-data-table
    v-model:checked-row-keys="Data.checkedRowKeys"
    striped
    :columns="columns"
    :row-key="(row: RowData) => row.dictname"
    :data="tableData"
    :loading="loading"
    flex-height
    :style="{ minHeight: `${tHeight}px` }"
  />
  <n-pagination
    v-model:page="Data.page.pageNum"
    v-model:page-size="Data.page.pageSize"
    :page-count="Data.page.totalPage"
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
