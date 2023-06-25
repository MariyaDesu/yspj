<script setup lang="ts">
import type { DataTableColumns } from 'naive-ui'
import { NButton, NDataTable } from 'naive-ui'

import { sysUserApi } from '@/api/sysManaApi'
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
const loading = ref<boolean>(false)
const Data = reactive({
  checkedRowKeys: [],
  str: '',
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
interface RowData {
  deptId: string
  deptName: string
  branchName: string
  supDept: string
  userId: number
  assets: Array<any>
  assetId?: number
  userName?: string
  userTypeName?: string
  sexName?: string
  statusName?: string
  linkmanName?: string
  linkmanMobile?: string
  linkmanQq?: string
  linkmanEmail?: string
  icon?: string
  age?: string
  provinceName?: string
  cityName?: string
  areaName?: string
  address?: string
  entryJobTime?: string
}
const column: DataTableColumns<RowData> = [
  { title: '', key: '', align: 'center', width: 67, ellipsis: { tooltip: true } },
  {
    title: '序号',
    key: 'index',
    align: 'center',
    width: 80,
    render: (_, index) => {
      return `${index + 1}`
    },
  },
  { title: '产权结构名称', key: 'assetName', align: 'center', width: 220, ellipsis: { tooltip: true } },
  { title: '管理结构名称', key: 'branchName', align: 'center', width: 120, ellipsis: { tooltip: true } },
  { title: '部门名称', key: 'deptName', align: 'center', width: 120, ellipsis: { tooltip: true } },
  { title: '审批角色名称', key: 'dutyName', align: 'center', width: 180, ellipsis: { tooltip: true } },
  { title: '', key: '', align: 'center', ellipsis: { tooltip: true } },
]

const columns: DataTableColumns<RowData> = [
  { type: 'selection' },
  {
    type: 'expand',
    renderExpand: (row, index) => {
      return [
        h(
          NDataTable, {
            columns: column,
            data: row.assets,
          },
        ),
      ]
    },
  },
  {
    title: '序号',
    key: 'index',
    align: 'center',
    width: 80,
    render: (_, index) => {
      return `${index + 1}`
    },
  },
  { title: '用户名称', key: 'userName', align: 'center', width: 200, ellipsis: { tooltip: true } },
  { title: '用户类型', key: 'userTypeName', align: 'center', width: 120, ellipsis: { tooltip: true } },
  { title: '性别', key: 'sexName', align: 'center', width: 80, ellipsis: { tooltip: true } },
  { title: '状态', key: 'statusName', align: 'center', width: 80, ellipsis: { tooltip: true } },
  { title: '联系人姓名', key: 'linkmanName', align: 'center', width: 120, ellipsis: { tooltip: true } },
  { title: '联系人电话', key: 'linkmanMobile', align: 'center', width: 120, ellipsis: { tooltip: true } },
  { title: '联系人QQ', key: 'linkmanQq', align: 'center', width: 120, ellipsis: { tooltip: true } },
  { title: '联系人EMAIL', key: 'linkmanEmail', align: 'center', width: 180, ellipsis: { tooltip: true } },
  { title: '图像', key: 'icon', align: 'center', width: 80, ellipsis: { tooltip: true } },
  { title: '年龄', key: 'age', align: 'center', width: 80, ellipsis: { tooltip: true } },
  { title: '省', key: 'provinceName', align: 'center', width: 120, ellipsis: { tooltip: true } },
  { title: '市', key: 'cityName', align: 'center', width: 120, ellipsis: { tooltip: true } },
  { title: '区', key: 'areaName', align: 'center', width: 120, ellipsis: { tooltip: true } },
  { title: '详细地址', key: 'address', align: 'center', width: 300, ellipsis: { tooltip: true } },
  { title: '入职时间', key: 'entryJobTime', align: 'center', width: 200, ellipsis: { tooltip: true } },
  { title: '创建人', key: 'createdName', align: 'center', width: 120, ellipsis: { tooltip: true } },
  { title: '创建时间', key: 'createdTime', align: 'center', width: 120, ellipsis: { tooltip: true } },
  { title: '', key: '', align: 'center', ellipsis: { tooltip: true } },
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
            hidden: !showBtn('分配角色', props.buttons),
            style: {
              marginLeft: '2px',
              marginRight: '2px',
            },
            onClick: () => handleAllocat(row),
          },
          { default: () => '分配角色', icon: renderIcon('fluent:text-align-distributed-24-filled', { size: 14 }) },
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
    '用户名称',
    '用户密码',
    '用户类型',
    '性别',
    '状态',
    '联系人姓名',
    '联系人电话',
    '联系人QQ',
    '联系人EMAIL',
    '年龄',
    '省',
    '市',
    '区',
    '详细地址',
    '入职时间',
    '创建人',
    '创建时间',
  ]
  const filterVal = [
    'userName',
    'password',
    'userTypeName',
    'sexName',
    'statusName',
    'linkmanName',
    'linkmanMobile',
    'linkmanQq',
    'linkmanEmail',
    'age',
    'provinceName',
    'cityName',
    'areaName',
    'address',
    'entryJobTime',
    'createdName',
    'createdTime',
  ]
  const data = arr.map(v => filterVal.map(j => v[j]))
  Export(data, fields, '用户')
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
          const res = await sysUserApi.getSysUserList(params)
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
          if (itemChildren === item.userId)
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
    const res = await sysUserApi.getSysUserList(Data.params)
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
  const params = row.userId ? [row.userId] : row
  window.$dialog?.warning({
    title: '确认删除？',
    negativeText: '取消',
    positiveText: '确认',
    onPositiveClick: async () => {
      const res = await sysUserApi.removeUser(params)
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

function handleAllocat(row: RowData) {
  instance?.proxy?.$Bus.emit('trasfer', row)
}
function handleEdit(row: RowData) {
  instance?.proxy?.$Bus.emit('edit', row)
}
</script>

<template>
  <NDataTable
    v-model:checked-row-keys="Data.checkedRowKeys"
    single-column striped :columns="columns"
    :row-key="(row:RowData) => row.userId" :data="tableData" :loading="loading"
    :scroll-x="2200 + 100 * props.metaLength" flex-height :style="{ minHeight: `${tHeight}px` }"
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

