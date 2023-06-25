<script setup lang="ts">
import type { DataTableColumns } from 'naive-ui'
import { NButton } from 'naive-ui'
import { sysRoleApi } from '@/api/sysManaApi'
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
  roleId: string
  enabled: number
}
const userTrasfertableData = ref()
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
  { title: '角色编码', key: 'roleCode', align: 'center', width: 100, ellipsis: { tooltip: true } },
  { title: '角色名称', key: 'roleName', align: 'center', width: 120, ellipsis: { tooltip: true } },
  {
    title: '是否启用',
    key: 'enabled',
    align: 'center',
    width: 60,
    ellipsis: { tooltip: true },
    render(row) {
      return row.enabled ? '启用' : '不启用'
    },
  },
  {
    title: '排序',
    key: 'sort',
    align: 'center',
    width: 40,
    ellipsis: { tooltip: true },
  },
  { title: '创建人', key: 'createdName', align: 'center', width: 80, ellipsis: { tooltip: true } },
  { title: '创建时间', key: 'createdTime', align: 'center', width: 150, ellipsis: { tooltip: true } },
  { title: '备注', key: 'memo', align: 'center', width: 80, ellipsis: { tooltip: true } },
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
            type: 'primary',
            hidden: !showBtn('分配按钮权限', props.buttons),
            style: {
              marginLeft: '2px',
              marginRight: '2px',
            },
            onClick: () => handleAllocat(row),
          },
          { default: () => '分配按钮权限', icon: renderIcon('fluent:text-align-distributed-24-filled', { size: 14 }) },
        ),
        h(
          NButton,
          {
            size: 'small',
            type: 'primary',
            hidden: !showBtn('分配菜单权限', props.buttons),
            style: {
              marginLeft: '2px',
              marginRight: '2px',
            },
            onClick: () => handleAllocatMenu(row),
          },
          { default: () => '分配菜单权限', icon: renderIcon('fluent:text-align-distributed-24-filled', { size: 14 }) },
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
instance?.proxy?.$Bus.on('fetchData', () => {
  initTableData()
})
instance?.proxy?.$Bus.on('search', (searchValue: any) => {
  Data.page.pageNum = 1
  Data.params = { ...searchValue }
  initTableData()
})
instance?.proxy?.$Bus.on('delete', async () => {
  await handleDelete(Data.checkedRowKeys)
})

async function handleAllocat(row: RowData) {
  await fetchData(row.roleId)
  instance?.proxy?.$Bus.emit('trasferBtn', { row, userTrasfertableData: userTrasfertableData.value })
}

async function handleAllocatMenu(row: RowData) {
  instance?.proxy?.$Bus.emit('trasferMenu', row)
}
onMounted(() => {
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
// 初始化数据
async function initTableData() {
  loading.value = true
  try {
    Data.params.pageNum = Data.page.pageNum
    Data.params.pageSize = Data.page.pageSize
    const res = await sysRoleApi.getSysRoleList(Data.params)
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
  const params = row.roleId ? [row.roleId] : row
  window.$dialog?.warning({
    title: '确认删除？',
    negativeText: '取消',
    positiveText: '确认',
    onPositiveClick: async () => {
      const res = await sysRoleApi.removeRole(params)
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

async function fetchData(roleId: string) {
  const res = await sysRoleApi.getMenuButton({ roleId })
  if (res.code === 200)
    userTrasfertableData.value = res.data
}
</script>

<template>
  <n-data-table
    v-model:checked-row-keys="Data.checkedRowKeys" single-column striped :columns="columns"
    :row-key="(row: RowData) => row.roleId" :data="tableData" :loading="loading" :scroll-x="1100 + 100 * props.metaLength" flex-height
    :style="{ minHeight: `${tHeight}px` }"
  />
  <n-pagination
    v-model:page="Data.page.pageNum" v-model:page-size="Data.page.pageSize"
    :page-count="Data.page.totalPage" size="large" show-quick-jumper show-size-picker :page-sizes="[10, 20, 50, 100]"
    :on-update:page="pageChange" :on-update:page-size="pageSizeChange" f-r-r mt-10
  />
</template>

