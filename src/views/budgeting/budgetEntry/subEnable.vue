<script setup lang="ts">
import type { DataTableColumns } from 'naive-ui'
import { NButton } from 'naive-ui'
import { budgetEntryApi } from '@/api/budgetApi'

import { useAppStore } from '@/store'
const appStore = useAppStore()
const tHeight = ref(appStore.tHeight - 270)
interface RowData {
  id: number
  title: string
  name: string
  balanceDirectionName: string
  instructions: string
}
const columns: DataTableColumns<RowData> = [
  { type: 'selection' },
  { title: '预算科目代码', key: 'code', width: 80, align: 'center', ellipsis: { tooltip: true } },
  { title: '预算科目名称', key: 'name', width: 80, align: 'center', ellipsis: { tooltip: true } },
  {
    title: '余额方向',
    key: 'balanceDirectionName',
    align: 'center',
    width: 80,
  },
  { title: '说明', key: 'instructions', width: 80, align: 'center', ellipsis: { tooltip: true } },
  {
    title: '启用',
    key: 'flagName',
    width: 80,
    align: 'center',
  },
]
const search = reactive({
  code: '',
  name: '',
})
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
  modalVisible: false,
  id: '',
  processId: '',
  processOptions: [],
  checkedRowKeys: [],
})

const loading = ref<boolean>(false)
const tableData = ref([])
const instance = getCurrentInstance()
// 初始化数据
async function initTableData() {
  loading.value = true
  try {
    const res = await budgetEntryApi.budgetEntryListDisable({ code: search.code, name: search.name })
    if (res.code === 200)
      tableData.value = res.data.list
    else
      window.$notification?.error({ title: res.message, duration: 2500 })
  }
  catch (error) {
    console.error(error)
    tableData.value = []
    loading.value = false
  }
  loading.value = false
}
// 更新预算科目
function fetchMenuTable() {
  instance?.proxy?.$Bus.emit('fetchMenuTableData')
}
//
function fetchTableData() {
  instance?.proxy?.$Bus.emit('fetchBudEntryTableData')
}
function searchHandle() {
  initTableData()
}
// 启用
async function handleEnable(keyArray: Array<number>) {
  window.$dialog?.warning({
    title: '确认启用？',
    negativeText: '取消',
    positiveText: '确认',
    onPositiveClick: async () => {
      const res = await budgetEntryApi.removeBudEntry({ list: keyArray, flag: 0 })
      if (res.code === 200) {
        window.$message?.success('启用成功')
        initTableData()
        fetchMenuTable()
        fetchTableData()
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
  instance?.proxy?.$Bus.on('subEnable', () => {
    Data.modalVisible = !Data.modalVisible
    initTableData()
  },
  )
})
</script>

<template>
  <n-modal
    v-model:show="Data.modalVisible" class="custom-card" preset="card" title="预算科目启用" size="huge"
  >
    <n-layout pl-10>
      <n-layout-header flex>
        <n-space flex-1 min-w-380>
          <n-form-item label="预算科目代码">
            <n-input v-model:value="search.code" />
          </n-form-item>
          <n-form-item label="预算科目名称">
            <n-input v-model:value="search.name" />
          </n-form-item>
        </n-space>
        <n-space m-auto>
          <NButton type="primary" @click="handleEnable(Data.checkedRowKeys)">
            启用
          </NButton>
          <NButton type="primary" @click="searchHandle">
            查找 ( F )
          </NButton>
        </n-space>
      </n-layout-header>
      <!-- 内容 -->
      <n-layout mt-10>
        <n-data-table
          v-model:checked-row-keys="Data.checkedRowKeys" :columns="columns"
          :row-key="(row: RowData) => row.id" :data="tableData" :loading="loading" :scroll-x="1000" flex-height
          :style="{ minHeight: `${tHeight}px` }"
        />
        <n-pagination
          v-model:page="Data.page.pageNum" v-model:page-size="Data.page.pageSize" mt-20
          :page-count="Data.page.totalPage" size="large" show-quick-jumper show-size-picker
          :page-sizes="[10, 20, 50, 100]" :on-update:page="pageChange" :on-update:page-size="pageSizeChange" f-r-r
        />
      </n-layout>
    </n-layout>
  </n-modal>
</template>

<style scoped>

</style>
