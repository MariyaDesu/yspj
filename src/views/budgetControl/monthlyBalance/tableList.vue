<script setup lang="ts">
import { NButton } from 'naive-ui'
import { budgetApprovalListApi } from '@/api/budgetApi'
import { approvalApi } from '@/api/budgetControlApi'
import { showBtn } from '@/utils/common'
import { useAppStore } from '@/store'
const props = defineProps<{
  buttons: string[]
  metaLength: number
  metaTitleLength: number
}>()
const appStore = useAppStore()
const tHeight = ref(appStore.tHeight - 320 + (props.metaTitleLength === 0 ? 42 : 0))
const loading = ref<boolean>(false)
const tableData = ref([])
const Data = reactive({
  page: {
    pageNum: 1,
    pageSize: 10,
    totalPage: 0,
  },
  params: {
    pageNum: 0,
    pageSize: 0,
    isHistory: 0,
  },
  flag: true,
  showModal: false,
  auditInfo: '',
  keyVal: -1,
  checkedRowKeys: [],
})
const instance = getCurrentInstance()
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
instance?.proxy?.$Bus.on('searchBudApproval', (searchValue: any) => {
  Data.page.pageNum = 1
  Data.params = { ...searchValue }
  initTableData()
})

instance?.proxy?.$Bus.on('fetchBudApprovalTableData', () => {
  initTableData()
})
const xTable = ref()
async function initTableData() {
  loading.value = true
  try {
    Data.params.pageNum = Data.page.pageNum
    Data.params.pageSize = Data.page.pageSize
    Data.params.isHistory = 0
    const res = await approvalApi.getListControlByAdminCreated(Data.params)
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

async function editMsg() {
  const key: any = []
  xTable.value.getCheckboxRecords().forEach((item) => {
    key.push(item.instanceId)
  })
  if (Data.keyVal === 0) {
    const res = await budgetApprovalListApi.batchExecuteOperation({ instanceIds: key, status: 2, value: 1, auditInfo: Data.auditInfo ? Data.auditInfo : '无' })
    if (res.code === 200)
      window.$notification?.success({ title: `${res.message}`, duration: 2500 })

    else
      window.$notification?.error({ title: `${res.message}`, duration: 2500 })
    Data.showModal = false
    initTableData()
  }
  else if (Data.keyVal === 1) {
    const res = await budgetApprovalListApi.batchExecuteOperation({ instanceIds: key, status: 1, value: 3, auditInfo: Data.auditInfo ? Data.auditInfo : '无' })
    if (res.code === 200)
      window.$notification?.success({ title: `${res.message}`, duration: 2500 })

    else
      window.$notification?.error({ title: `${res.message}`, duration: 2500 })

    Data.showModal = false
    initTableData()
  }
  else {
    Data.showModal = false
    initTableData()
  }
}
</script>

<template>
  <vxe-table
    ref="xTable"
    border :tree-config="{
      indent: 16,
      trigger: 'cell',

    }" :loading="loading" :column-config="{ resizable: true }" :data="tableData" :height="tHeight" class="mytable-scrollbar"
  >
    <vxe-column type="checkbox" width="60" fixed="left" />
    <vxe-column type="seq" width="60" title="序号" />
    <vxe-column field="name" title="预算方案" width="200" />
    <vxe-column field="periods" title="期" width="300" />
    <vxe-column field="years" title="年" width="200" />
    <vxe-column field="ifMonthlySettlementName" title="是否月结" width="200" />
    <vxe-column field="budAmount" title="本期预算金额" width="100" />
    <vxe-column field="executeAmount" title="本期执行金额" width="100" />
    <vxe-column field="beforeAmount" title="上期结余" width="200" />
    <vxe-column field="amount" title="本期结余" width="200" />
    <vxe-column field="memo" title="结账日期" width="200" />
    <vxe-column field="memoTwo" title="备注字段2" width="200" />
    <vxe-table-column title="操作" width="220" show-overflow align="center" fixed="right">
      <template #default="scope">
        <!-- <NButton type="info" ml-10 mr-10 :hidden="!showBtn('查看详情', props.buttons)" size="small" @click="handleDetails(scope.row)">
          查看详情
        </NButton> -->
        <NButton type="info" ml-10 mr-10 size="small">
          月结
        </NButton>
        <NButton type="info" ml-10 mr-10 size="small">
          反月结
        </NButton>
      </template>
    </vxe-table-column>
  </vxe-table>

  <n-pagination
    v-model:page="Data.page.pageNum" v-model:page-size="Data.page.pageSize" :page-count="Data.page.totalPage"
    size="large" show-quick-jumper show-size-picker :page-sizes="[10, 20, 50, 100]" :on-update:page="pageChange"
    :on-update:page-size="pageSizeChange" f-r-r mt-10
  />
  <n-modal
    v-model:show="Data.showModal" class="custom-card" preset="card" title="审批意见" size="huge"
    :style="{ width: '50vw' }"
  >
    <n-input v-model:value="Data.auditInfo" type="textarea" placeholder="" />
    <template #footer>
      <NLayout text-center>
        <NButton type="info" mr-5 w-80 @click="editMsg()">
          确定
        </NButton>
        <NButton type="info" ml-5 w-80 @click="Data.showModal = false">
          取消
        </NButton>
      </NLayout>
    </template>
  </n-modal>
</template>

