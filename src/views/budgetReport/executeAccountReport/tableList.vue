<script setup lang="ts">
import { budgetReportApi } from '@/api/budgetReportApi'
import { useAppStore } from '@/store'
// import { setChildrenList } from '@/utils/common'

const props = defineProps<{
  metaTitleLength: number
}>()

const appStore = useAppStore()

const tHeight = ref(appStore.tHeight - 340 + (props.metaTitleLength === 0 ? 42 : 0))

const loading = ref<boolean>(false)
const tableData = ref([])
const detailData = ref([])
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
    budgetOrExecute: 2,
    hierarchy: '',
    codeAndNameParent: '',
    matter: '',
    codeAndName: '',
  },
  showDetail: false,
})
const instance = getCurrentInstance()
instance?.proxy?.$Bus.off('search')
instance?.proxy?.$Bus.off('fetchData')
instance?.proxy?.$Bus.on('search', (searchValue: any) => {
  Data.page.pageNum = 1
  Data.params = { ...searchValue }
  Data.params.budgetOrExecute = 2
  initTableData()
})
instance?.proxy?.$Bus.on('fetchData', () => {
  initTableData()
})
onMounted(() => {
  initTableData()
})

async function initTableData() {
  loading.value = true
  try {
    Data.params.pageNum = Data.page.pageNum
    Data.params.pageSize = Data.page.pageSize
    Data.params.budgetOrExecute = 2
    const res = await budgetReportApi.fetchAccountReport(Data.params)
    if (res.code === 200) {
      tableData.value = res.data
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

async function showDetail(e) {
  if (e.row.hierarchy === 3) {
    Data.params.hierarchy = e.row.hierarchy
    Data.params.codeAndNameParent = e.row.codeAndNameParent
  }
  if (e.row.hierarchy === 4) {
    Data.params.hierarchy = e.row.hierarchy
    Data.params.codeAndNameParent = e.row.codeAndNameParent
    Data.params.matter = e.row.matter
  }
  Data.params.codeAndName = e.row.codeAndName
  initDetailTable()
  Data.showDetail = true
}

async function initDetailTable() {
  Data.params.pageNum = Data.page.pageNum
  Data.params.pageSize = Data.page.pageSize
  const res = await budgetReportApi.amountSourceOne(Data.params)
  detailData.value = res.data.list
  Data.page.pageNum = res.data.pageNum
  Data.page.pageSize = res.data.pageSize
  Data.page.totalPage = res.data.totalPage
}

function rowClassName(row): any {
  if (row.row.hierarchy === 0) {
    return {
      backgroundColor: 'rgba(221, 235, 247, 0.3)',
    }
  }
  else if (row.row.hierarchy === 1) { return { backgroundColor: 'rgba(255, 244, 204, 0.3)' } }
  else if (row.row.hierarchy === 2) { return { backgroundColor: 'rgba(226, 239, 218, 0.3)' } }
  else if (row.row.hierarchy === 3) { return { backgroundColor: 'rgba(252, 228, 214, 0.3)' } }
  return { backgroundColor: 'rgba(214, 220, 228, 0.3)' }
}

function pageChange(val) {
  Data.page.pageNum = val
  initDetailTable()
}
function pageSizeChange(val) {
  Data.page.pageNum = 1
  Data.page.pageSize = val
  initDetailTable()
}
</script>

<template>
  <vxe-table
    :loading="loading"
    border :column-config="{ resizable: true }" :tree-config="{
      children: 'statementList',
      indent: 16,
      trigger: 'cell',

    }" :row-style="rowClassName" :data="tableData" :height="tHeight" class="mytable-scrollbar" @cell-dblclick="showDetail($event)"
  >
    <vxe-column type="seq" width="60" title="序号" fixed="left" />

    <vxe-column field="codeAndName" title="科目名称" width="300" fixed="left" tree-node />
    <vxe-column field="hierarchy" title="当前级别" width="100">
      <template #default="{ row }">
        {{ row.hierarchy + 1 }}
      </template>
    </vxe-column>
    <vxe-column field="contractStateName" title="是否有合同" width="100" />
    <vxe-column field="su" title="合计" width="200" formatter="formatAmount" align="right" />
    <vxe-column field="one" title="1月" width="200" formatter="formatAmount" align="right" />
    <vxe-column field="two" title="2月" width="200" formatter="formatAmount" align="right" />
    <vxe-column field="three" title="3月" width="200" formatter="formatAmount" align="right" />
    <vxe-column field="four" title="4月" width="200" formatter="formatAmount" align="right" />
    <vxe-column field="five" title="5月" width="200" formatter="formatAmount" align="right" />
    <vxe-column field="six" title="6月" width="200" formatter="formatAmount" align="right" />
    <vxe-column field="seven" title="7月" width="200" formatter="formatAmount" align="right" />
    <vxe-column field="eight" title="8月" width="200" formatter="formatAmount" align="right" />
    <vxe-column field="nine" title="9月" width="200" formatter="formatAmount" align="right" />
    <vxe-column field="ten" title="10月" width="200" formatter="formatAmount" align="right" />
    <vxe-column field="eleven" title="11月" width="200" formatter="formatAmount" align="right" />
    <vxe-column field="twelve" title="12月" width="200" formatter="formatAmount" align="right" />
    <!-- <template v-for="item in columns.tableColumns" :key="item.key">
      <vxe-column :field="item.field" :title="item.title" />
    </template> -->
  </vxe-table>

  <n-modal
    v-model:show="Data.showDetail" class="custom-card" preset="card"
    title="查看详情" size="huge"
    :style="{ minHeight: `${tHeight + 300}px` }"
  >
    <vxe-table
      class="mytable-scrollbar"
      :height="tHeight + 200"
      :data="detailData"
    >
      <vxe-column field="budControlPayCode" title="收支编码" width="200" />
      <vxe-column field="budInOutName" title="预算内/外名称" width="200" />
      <vxe-column field="assetName" title="产权结构名称" width="300" />
      <vxe-column field="branchName" title="管理结构名称" width="200" />
      <vxe-column field="bankName" title="银行名称" width="200" />
      <vxe-column field="bankAccountNumber" title="银行账号" width="200" />
      <vxe-column field="eachAmount" title="收支金额" width="200" />
      <vxe-column field="dictValue" title="收支类型" width="100" />
      <vxe-column field="payTime" title="收支日期" width="200" />
      <vxe-column field="abstracts" title="摘要" width="" min-width="300" />
    </vxe-table>

    <n-pagination
      v-model:page="Data.page.pageNum" v-model:page-size="Data.page.pageSize" :page-count="Data.page.totalPage"
      size="large" show-quick-jumper show-size-picker :page-sizes="[10, 20, 50, 100]" :on-update:page="pageChange"
      :on-update:page-size="pageSizeChange" f-r-r mt-10
    />
  </n-modal>
</template>

<style scoped>
:deep(.red td) {
  background-color: rgba(252, 228, 214,0.3) !important;
}

:deep(.yellow td) {
  background-color: rgba(255, 244, 204,0.3) !important;
}

:deep(.blue td) {
  background-color: rgba(221, 235, 247,0.3) !important;
}

:deep(.blue3 td) {
  background-color: rgba(214, 220, 228,0.3) !important;
}

:deep(.green td) {
  background-color: rgba(226,239,218,0.3) !important;
}
</style>

