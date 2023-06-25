<script setup lang="ts">
import type { DataTableColumns } from 'naive-ui'
import { NDataTable } from 'naive-ui'

import { baseApi } from '@/api/baseApi'

import { useAppStore } from '@/store'

const appStore = useAppStore()

const tHeight = ref(appStore.tHeight - 320)

interface IRowData {
  id: number
  isRead: number
  sendMessage: string
  createdName: string
  createdTime: string
}
const column: DataTableColumns<IRowData> = [
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
  { title: '消息内容', key: 'sendMessage', align: 'center', width: 500, ellipsis: { tooltip: true } },
  {
    title: '是否已读',
    key: 'isRead',
    align: 'center',
    width: 80,
    ellipsis: { tooltip: true },
    render: (row) => {
      return row.isRead === 0 ? '否' : '是'
    },
  },
  { title: '审批人', key: 'createdName', align: 'center', width: 150, ellipsis: { tooltip: true } },
  { title: '审批时间', key: 'createdTime', align: 'center', width: 150, ellipsis: { tooltip: true } },
]
const loading = ref<boolean>(false)
const readtableData = ref([])
const noReadtableData = ref([])
const readNumber = ref(0)
const Data = reactive({
  readPage: {
    pageNum: 1,
    pageSize: 10,
    totalPage: 0,
  },
  noReadPage: {
    pageNum: 1,
    pageSize: 10,
    totalPage: 0,
  },
  readParams: {
    pageNum: 0,
    pageSize: 0,
    isRead: 1,
  },
  noReadParams: {
    pageNum: 0,
    pageSize: 0,
    isRead: 0,
  },
  isHide: false,
  checkedRowKeys: [],
  timer: '',
})
async function readinitTableData() {
  loading.value = true
  try {
    Data.readParams.pageNum = Data.readPage.pageNum
    Data.readParams.pageSize = Data.readPage.pageSize
    const res = await baseApi.instanceMessageGetList(Data.readParams)
    if (res.code === 200) {
      readtableData.value = res.data.list
      Data.readPage.pageNum = res.data.pageNum
      Data.readPage.pageSize = res.data.pageSize
      Data.readPage.totalPage = res.data.totalPage
    }
  }
  catch (error) {
    console.error(error)
    readtableData.value = []
  }
  loading.value = false
}

async function noreadinitTableData() {
  loading.value = true
  try {
    Data.noReadParams.pageNum = Data.noReadPage.pageNum
    Data.noReadParams.pageSize = Data.noReadPage.pageSize
    const res = await baseApi.instanceMessageGetList(Data.noReadParams)
    if (res.code === 200) {
      noReadtableData.value = res.data.list
      Data.noReadPage.pageNum = res.data.pageNum
      Data.noReadPage.pageSize = res.data.pageSize
      Data.noReadPage.totalPage = res.data.totalPage
    }
  }
  catch (error) {
    console.error(error)
    noReadtableData.value = []
  }
  loading.value = false
}

function pageChange(val) {
  Data.readPage.pageNum = val
  readinitTableData()
}
function pageSizeChange(val) {
  Data.readPage.pageNum = 1
  Data.readPage.pageSize = val
  readinitTableData()
}
async function submit() {
  if (Data.checkedRowKeys.length === 0) {
    window.$notification?.warning({ title: '请先选择消息', duration: 2500 })
    return
  }

  const res = await baseApi.instanceMessageReadMessage(Data.checkedRowKeys)
  if (res.code === 200) {
    window.$notification?.success({ title: `${res.message}`, duration: 2500 })
    readinitTableData()
    noreadinitTableData()
    instanceGetMessageCount()
  }

  else { window.$notification?.error({ title: `${res.message}`, duration: 2500 }) }
}

async function instanceGetMessageCount() {
  try {
    const res = await baseApi.instanceGetMessageCount({ isRead: 0 })
    if (res.code === 200)
      readNumber.value = res.data
  }
  catch (error) {
    return Promise.reject(error)
  }
}

onMounted(() => {
  readinitTableData()
  noreadinitTableData()
  instanceGetMessageCount()
})
</script>

<template>
  <n-button size="large" text strong pl-15 @click="Data.isHide = true">
    <template #icon>
      <icon-fe:notice-active />
    </template>
    <NH5 :style="{ backgroundColor: readNumber === 0 ? '#ccc' : '#f56c6c', padding: '2px 8px', borderRadius: '10px', fontSize: '14px' }">
      {{ readNumber }}
    </NH5>
  </n-button>
  <n-modal v-model:show="Data.isHide" class="custom-card" preset="card" title="消息" size="huge" :style="{ }">
    <n-tabs default-value="noRead" type="line" animated>
      <n-tab-pane name="noRead" tab="未读消息">
        <NDataTable
          v-model:checked-row-keys="Data.checkedRowKeys" single-column striped :columns="column"
          :row-key="(row: IRowData) => row.id" :data="noReadtableData" :loading="loading" flex-height
          :style="{ minHeight: `${tHeight}px` }" bg-white
        />

        <n-layout-header flex mt-10>
          <n-space flex-1 m-auto text-16 font-600>
            <NButton type="info" @click="submit">
              确认已读
            </NButton>
          </n-space>
          <n-space m-auto>
            <n-pagination
              v-model:page="Data.noReadPage.pageNum" v-model:page-size="Data.noReadPage.pageSize"
              :page-count="Data.noReadPage.totalPage" size="large" show-quick-jumper show-size-picker
              :page-sizes="[10, 20, 50, 100]" :on-update:page="pageChange" :on-update:page-size="pageSizeChange" f-r-r
            />
          </n-space>
        </n-layout-header>
      </n-tab-pane>
      <n-tab-pane name="read" tab="已读消息">
        <NDataTable
          single-column striped :columns="column" :row-key="(row: IRowData) => row.id" :data="readtableData"
          :loading="loading" flex-height :style="{ minHeight: `${tHeight}px` }" bg-white
        />
        <n-pagination
          v-model:page="Data.readPage.pageNum" v-model:page-size="Data.readPage.pageSize"
          :page-count="Data.readPage.totalPage" size="large" show-quick-jumper show-size-picker
          :page-sizes="[10, 20, 50, 100]" :on-update:page="pageChange" :on-update:page-size="pageSizeChange" f-r-r
          mt-10
        />
      </n-tab-pane>
    </n-tabs>
  </n-modal>
</template>

<style scoped></style>
