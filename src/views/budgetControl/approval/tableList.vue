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
interface RowData {
  id: string
  processId: string
  instanceId: string
  stepId: string
  auditInfo: string
  memo: string
  status: number
  statusName: string
  billTypeId: string
  assetId: string
  branchId: string
  deptId: string
  compileId: string
  nodeStatus: number
  projectNameList: Array<any>
}

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
async function handleDetails(row: RowData) {
  instance?.proxy?.$Bus.emit('changeAppAffairs', { row, flag: Data.flag })
  instance?.proxy?.$Bus.emit('edit', { row, type: Data.flag })
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
  initTableData()
})
instance?.proxy?.$Bus.on('searchBudApproval', (searchValue: any) => {
  Data.page.pageNum = 1
  Data.params = { ...searchValue }
  initTableData()
})
instance?.proxy?.$Bus.on('searchBatchPass', () => {
  batchExecuteOperation()
})
instance?.proxy?.$Bus.on('batchRecall', () => {
  batchRecall()
})

instance?.proxy?.$Bus.on('batchReturn', () => {
  batchReturn()
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
// 通过
async function batchExecuteOperation() {
  if (xTable.value.getCheckboxRecords().length === 0)
    window.$notification?.warning({ title: '请先选择审批单', duration: 2500 })

  else
    showAuditInfo(0)
}
// 撤回
async function batchRecall() {
  if (xTable.value.getCheckboxRecords().length === 0) {
    window.$notification?.warning({ title: '请先选择审批单', duration: 2500 })
  }
  else {
    window.$dialog?.warning({
      title: '确认撤回？',
      negativeText: '取消',
      positiveText: '确认',
      onPositiveClick: async () => {
        const key: any = []
        xTable.value.getCheckboxRecords().forEach((item) => {
          key.push(item.instanceId)
        })
        const res = await budgetApprovalListApi.batchExecuteOperation({ instanceIds: key, status: 1, value: 2 })
        if (res.code === 200)
          window.$notification?.success({ title: `${res.message}`, duration: 2500 })

        else
          window.$notification?.error({ title: `${res.message}`, duration: 2500 })

        initTableData()
      },
      onNegativeClick: () => {
        window.$message?.success('已取消')
      },
    })
  }
}
// 退回
async function batchReturn() {
  if (xTable.value.getCheckboxRecords().length === 0)
    window.$notification?.warning({ title: '请先选择审批单', duration: 2500 })

  else
    showAuditInfo(1)
}

function showAuditInfo(key) {
  Data.keyVal = key
  Data.showModal = true
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
    <vxe-column type="expand" title="" width="80" fixed="left">
      <template #content="{ row }">
        <vxe-table
          border :column-config="{ resizable: true }" :tree-config="{
            indent: 16,
            trigger: 'cell',
            expandAll: true,
          }" :data="row.budControlPayList"
        >
          <vxe-column type="seq" width="60" title="序号" />
          <vxe-column field="budInOutName" title="预算内/外" width="200" />
          <vxe-column field="compileCode" title="预算编码" width="300" />
          <vxe-column field="matter" title="预算事项明细" width="200" />
          <vxe-column field="codeAndName" title="预算科目" width="200" />
          <vxe-column field="eachAmount" title="收入金额" width="200" />
        </vxe-table>
      </template>
    </vxe-column>

    <vxe-column type="seq" width="60" title="序号" />
    <vxe-column field="compileCode" title="调整编号" width="200" />
    <vxe-column field="assetName" title="产权结构" width="300" />
    <vxe-column field="abstracts" title="摘要" width="200" />
    <vxe-column field="baseNumberSum" title="总金额" width="200" />
    <vxe-column field="payTime" title="调整日期" width="100" />
    <vxe-column field="branchName" title="管理结构" width="100" />
    <vxe-column field="bankName" title="银行名称" width="200" />
    <vxe-column field="bankAccountNumber" title="银行账号" width="200" />

    <vxe-column field="status" title="状态" width="" :min-width="200">
      <template #default="scope">
        {{ scope.row.status === 0 ? '审批中' : scope.row.status === 1 ? '未通过' : scope.row.status === 2 ? '已通过' : '' }}
      </template>
    </vxe-column>

    <vxe-table-column title="操作" width="120" show-overflow align="center" fixed="right">
      <template #default="scope">
        <NButton type="info" ml-10 mr-10 :hidden="!showBtn('查看详情', props.buttons)" size="small" @click="handleDetails(scope.row)">
          查看详情
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

