<script setup lang="ts">
import type { DataTableColumns } from 'naive-ui'
import { NButton } from 'naive-ui'
import { budgetEntryApi } from '@/api/budgetApi'
import { isNullOrUndef, renderIcon, showBtn } from '@/utils/common'
import { useAppStore } from '@/store'
import Export from '@/vendor/Export.js'

const props = defineProps<{
  buttons: string[]
  metaLength: number
  metaTitleLength: number
}>()

const appStore = useAppStore()
const tHeight = ref(appStore.tHeight - 215 + (props.metaTitleLength === 0 ? 44 : 0))
interface RowData {
  id: string
}

const columns: DataTableColumns<RowData> = [
  { type: 'selection' },
  { title: '预算科目代码', key: 'code', width: 120, align: 'left', ellipsis: { tooltip: true } },
  { title: '预算科目名称', key: 'name', width: 200, align: 'center', ellipsis: { tooltip: true } },
  {
    title: '余额方向',
    key: 'balanceDirectionName',
    align: 'center',
    width: 80,
    ellipsis: { tooltip: true },
  },
  { title: '说明', key: 'instructions', width: 200, align: 'center', ellipsis: { tooltip: true } },
  {
    title: '启用',
    key: 'flagName',
    width: 80,
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
              marginLeft: '5px',
              marginRigth: '5px',
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
            style: {
              marginLeft: '5px',
              marginRigth: '5px',
            },
            hidden: !showBtn('停用', props.buttons),
            onClick: () => handleStop(row),
          },
          { default: () => '停用', icon: renderIcon('fe:disabled', { size: 14 }) },
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

const Data = reactive({
  params: {},
  modalVisible: false,
  id: '',
  processId: '',
  processOptions: [],
  checkedRowKeys: [],
})

const loading = ref<boolean>(false)

const tableData = ref([])
// 选中的科目id
const checkId = ref()
const instance = getCurrentInstance()
instance?.proxy?.$Bus.on('fetchBudEntryTableData', (id?: number) => {
  if (id) {
    checkId.value = id
    initTableData(id)
  }
})
// 初始化数据
async function initTableData(id?: number) {
  if (isNullOrUndef(id))
    return
  loading.value = true
  try {
    const res = await budgetEntryApi.getBudgetEntryList({ id })
    if (res.code === 200) { tableData.value = res.data }
    else {
      checkId.value = null
      tableData.value = []
    }
  }
  catch (error) {
    console.error(error)
    tableData.value = []
  }
  loading.value = false
}
// 停用
async function handleStop(row: RowData) {
  if (isNullOrUndef(row.id))
    return
  window.$dialog?.warning({
    title: '确认停用？',
    negativeText: '取消',
    positiveText: '确认',
    onPositiveClick: async () => {
      const res = await budgetEntryApi.removeBudEntry({ list: [row.id], flag: 1 })
      if (res.code === 200) {
        window.$message?.success('停用成功')
        initTableData(checkId.value)
        fetchMenuTable()
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

instance?.proxy?.$Bus.on('exportsExcel', () => {
  exportsExcel()
})

// 导出
function exportData(arr) {
  const fields = [
    '预算科目代码',
    '预算科目名称',
    '父预算科目编码',
    '父预算科目名称',
    '余额方向',
    '说明',
  ]
  const filterVal = [
    'code',
    'name',
    'parentCode',
    'parentName',
    'balanceDirectionName',
    'instructions',
  ]

  const data = arr.map(v => filterVal.map(j => v[j]))
  Export(data, fields, '预算科目')
}
async function exportsExcel() {
  try {
    instance?.proxy?.$Bus.emit('loading', true)
    let arr: {}[] = []
    if (Data.checkedRowKeys.length === 0) {
      window.$dialog?.warning({
        title: '确认导出全部？',
        negativeText: '取消',
        positiveText: '确认',
        onPositiveClick: async () => {
          const res = await budgetEntryApi.getOutPutList()
          if (res.code === 200) {
            arr = res.data
            exportData(arr)
            window.$message?.success('导出成功')
          }
        },
        onNegativeClick: () => {
          window.$message?.success('已取消')
        },
      })
    }
    else {
      tableData.value.forEach((item: { id: number }) => {
        Data.checkedRowKeys.forEach((itemChildren: number) => {
          if (itemChildren === item.id)
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

function handleEdit(row: RowData) {
  instance?.proxy?.$Bus.emit('edit', row)
}

function fetchMenuTable() {
  instance?.proxy?.$Bus.emit('fetchMenuTableData')
}
</script>

<template>
  <n-data-table
    v-model:checked-row-keys="Data.checkedRowKeys" :columns="columns" :row-key="(row: RowData) => row.id"
    :data="tableData" :loading="loading" :scroll-x="700 + 100 * props.metaLength" flex-height
    :style="{ minHeight: `${tHeight}px` }" :pagination="paginationReactive"
  />
</template>

