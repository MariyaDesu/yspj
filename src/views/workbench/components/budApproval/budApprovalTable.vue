<script setup lang="ts">
import { NButton } from 'naive-ui'

import { useAppStore } from '@/store'
import { workBenchApi } from '@/api/workbench'
const appStore = useAppStore()
const tHeight = ref(appStore.tHeight - 330)
interface RowData {
  id: string
  processId: string
  instanceId: string
  stepId: string
  auditInfo: string
  memo: string
  status: number
  statusName: string
  billTypeId: number
  assetId: string
  branchId: string
  deptId: string
  compileId: string
  nodeStatus: number
  projectNameList: Array<any>
}

const loading = ref<boolean>(false)
const tableData = ref([])
const xTable = ref()
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
  isAffairs: true,
  modalVisible: false,
  auditInfo: '',
  keyVal: -1,
})
const instance = getCurrentInstance()
async function handleDetails(row: RowData) {
  if (row.billTypeId === 1) {
    instance?.proxy?.$Bus.emit('changeBudComplieAlterTableEdit', { row, isAffairs: Data.isAffairs })
    instance?.proxy?.$Bus.emit('edits', { row, isAffairs: Data.isAffairs })
  }
  else if (row.billTypeId === 2) {
    instance?.proxy?.$Bus.emit('changeBudAppAffairs', { row, isAffairs: Data.isAffairs })
    instance?.proxy?.$Bus.emit('edit', { row, isAffairs: Data.isAffairs })
  }
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
instance?.proxy?.$Bus.off('fetchBudApprovalTable')
instance?.proxy?.$Bus.on('fetchBudApprovalTable', (row: { isAffairs: boolean }) => {
  Data.isAffairs = row.isAffairs
  Data.modalVisible = true
  initTableData()
})
async function initTableData() {
  loading.value = true
  try {
    Data.params.pageNum = Data.page.pageNum
    Data.params.pageSize = Data.page.pageSize
    Data.params.isHistory = 0
    const res = Data.isAffairs ? await workBenchApi.getAffairs({ mStatus: 0 }) : await workBenchApi.getAffairs({ mStatus: 1 })
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
</script>

<template>
  <n-modal
    v-model:show="Data.modalVisible" class="custom-card" preset="card" title="查看审批详情" size="huge"
  >
    <vxe-table
      ref="xTable"
      :loading="loading
      "
      border :tree-config="{
        indent: 16,
        trigger: 'cell',

      }" :column-config="{ resizable: true }" :data="tableData" :height="tHeight" class="mytable-scrollbar"
    >
      <vxe-column type="checkbox" width="60" fixed="left" />
      <vxe-column type="expand" title="" width="80" fixed="left">
        <template #content="{ row }">
          <vxe-table
            border :column-config="{ resizable: true }" :tree-config="{
              indent: 16,
              trigger: 'cell',
              expandAll: true,
            }" :data="row.projectNameList"
          >
            <vxe-column type="seq" width="60" title="序号" />
            <vxe-column field="assetName" title="产权结构" width="250" />
            <vxe-column field="branchName" title="管理结构" width="150" />
            <vxe-column field="deptName" title="部门" width="150" />
            <vxe-column field="matter" title="预算事项明细" width="300" />
            <vxe-column field="codeAndName" title="科目" width="200" />
            <vxe-column field="baseNumber" title="金额" width="150" />
          </vxe-table>
        </template>
      </vxe-column>

      <vxe-column type="seq" width="60" title="序号" />
      <vxe-column field="compileCode" title="预算编号" width="250" />
      <vxe-column field="projectNames" title="立项名称" width="150" />
      <vxe-column field="contractStateName" title="有无合同" width="150" />
      <vxe-column field="compileName" title="预算事项" width="300" />
      <vxe-column field="feeTypeName" title="费用类型" width="200" />
      <vxe-column field="baseNumberSum" title="总金额" width="150" />
      <vxe-column field="preparationName" title="编制人" width="200" />
      <vxe-column field="status" title="流程执行状态" width="200">
        <template #default="scope">
          {{ scope.row.status === 0 ? '审批中' : scope.row.status === 1 ? '未通过' : scope.row.status === 2 ? '已完结' : '' }}
        </template>
      </vxe-column>
      <vxe-column field="nodeStatus" title="节点状态" width="" :min-width="200">
        <template #default="scope">
          {{ scope.row.status === 0 ? '审批中' : scope.row.status === 1 ? '未通过' : scope.row.status === 2 ? '已通过' : '' }}
        </template>
      </vxe-column>

      <vxe-table-column title="操作" width="120" show-overflow align="center" fixed="right">
        <template #default="scope">
          <NButton type="info" ml-10 mr-10 @click="handleDetails(scope.row)">
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
  </n-modal>
</template>

