<script setup lang="ts">
import VisiTab from './components/VisiTab.vue'
import { budgetReportApi } from '@/api/budgetReportApi'
import { useAppStore } from '@/store'
const props = defineProps<{
  metaTitleLength: number
}>()

const appStore = useAppStore()

const tHeight = ref(appStore.tHeight - 340 + (props.metaTitleLength === 0 ? 42 : 0))

const columns: any = reactive({
  tableColumns: [
  ],
  titleColumns: [
  ],
})
const loading = ref<boolean>(false)
const tableData = ref([])
interface IData {
  showSheet: boolean
  checkedRowKeys: any
  expandRowKeys: any
  page: any
  params: any
  sheetTitle: any
  sheetData: any
  showDetail: boolean
}
const detailData = ref([])
const Data: IData = reactive({
  showSheet: true,
  checkedRowKeys: [],
  expandRowKeys: [],
  page: {
    pageNum: 1,
    pageSize: 10,
    totalPage: 0,
  },
  params: {
    pageNum: 0,
    pageSize: 0,
    beginTimeYear: (new Date().getFullYear()).toString(),
    endTimeYear: new Date().getFullYear().toString(),
    beginTimeMounth: (new Date().getMonth() + 1).toString(),
    endTimeMounth: (new Date().getMonth() + 1).toString(),
  },
  sheetTitle: [
  ],
  sheetData: [],
  showDetail: false,
})
const instance = getCurrentInstance()
instance?.proxy?.$Bus.on('search', (searchValue: any) => {
  Data.page.pageNum = 1
  Data.params = { ...searchValue }
  initTitleData()
  initTableData()
})

instance?.proxy?.$Bus.on('change', () => {
  Data.showSheet = !Data.showSheet
})
instance?.proxy?.$Bus.on('fetchData', () => {
  initTableData()
})
onBeforeMount(() => {
  initTitleData()
  initTableData()
})

function initTable(tb) {
  for (let i = 0; i < tb.length; i++) {
    if (tb[i].statementList)
      initTable(tb[i].statementList)

    if (tb[i].maps) {
      for (const key in tb[i].maps)
        tb[i][key] = tb[i].maps[key]
    }
  }
  return tb
}
async function initTitleData() {
  loading.value = true
  try {
    const res = await budgetReportApi.fetchGetLastYearOutsideTitle(Data.params)
    if (res.code === 200) {
      Data.sheetData = []
      columns.titleColumns = []
      columns.tableColumns = []
      res.data.forEach((item, index) => {
        columns.titleColumns.push({ title: item.fieldValue, field: item.fieldName, align: 'left', width: 300 })
        columns.tableColumns.push({ title: item.fieldValue, field: item.fieldName, align: 'left', width: 300 })
        Data.sheetData.push({ name: item.fieldName, type: 'bar', data: [] })
      })
    }
  }
  catch (error) {
    console.error(error)
    tableData.value = []
  }
  loading.value = false
}
async function initTableData() {
  loading.value = true
  try {
    const res = await budgetReportApi.fetchNowAndLastYear(Data.params)
    Data.sheetTitle = []

    tableData.value = []
    if (res.code === 200) {
      tableData.value = res.data
      initTable(tableData.value)
      tableData.value.forEach((item: { oneCodeAndName: string; maps: string[] }) => {
        Data.sheetTitle.push(item.oneCodeAndName)
        Data.sheetData.forEach((el, index) => {
          for (const key in item.maps) {
            if (key === el.name)
              Data.sheetData[index].data.push(item.maps[key])
          }
        })
      })

      loading.value = false
    }
  }
  catch (error) {
    console.error(error)
    loading.value = false
    tableData.value = []
  }
}

async function showDetail(e) {
  Data.params.codeAndName = e.row.codeAndName
  initDetailTable()
  Data.showDetail = true
}

async function initDetailTable() {
  Data.params.pageNum = Data.page.pageNum
  Data.params.pageSize = Data.page.pageSize
  const res = await budgetReportApi.amountSourceThree(Data.params)
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
function forMatList(row): any {
  const statementMonthList: any = [
  ]
  row.forEach((item) => {
    item.maps.month = item.month
    statementMonthList.push(item.maps)
  })
  return statementMonthList
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
    v-if="Data.showSheet"
    :loading="loading"
    border :column-config="{ resizable: true }" :tree-config="{
      children: 'statementList',
      indent: 16,
      trigger: 'cell',

    }" :row-style="rowClassName" :data="tableData" :height="tHeight" class="mytable-scrollbar" @cell-dblclick="showDetail($event)"
  >
    <vxe-column type="expand" title="" width="80" fixed="left">
      <template #content="{ row }">
        <vxe-table
          border :column-config="{ resizable: true }" :tree-config="{
            indent: 16,
            trigger: 'cell',
            expandAll: true,
          }" :data="forMatList(row.statementMonthList)"
        >
          <vxe-column type="seq" width="60" title="序号" fixed="left" align="left" />
          <vxe-column field="month" title="月份" width="300" fixed="left" align="left" />

          <template v-for="(item, index) in columns.titleColumns" :key="item.key">
            <vxe-column v-if="index === 3" :field="item.field" :title="item.title" align="right" />
            <vxe-column v-else :field="item.field" :title="item.title" formatter="formatAmount" align="right" />
          </template>
        </vxe-table>
      </template>
    </vxe-column>
    <vxe-column type="seq" width="60" title="序号" fixed="left" />
    <vxe-column field="codeAndName" title="科目" width="300" tree-node fixed="left" />
    <template v-for="(item, index) in columns.tableColumns" :key="item.key">
      <vxe-column v-if="index === 3" :field="item.field" :title="item.title" align="right" />
      <vxe-column v-else :field="item.field" :title="item.title" formatter="formatAmount" align="right" />
    </template>
  </vxe-table>
  <VisiTab
    v-else bg-white :style="{ minHeight: `${tHeight > Data.sheetTitle.length * 100 ? tHeight : Data.sheetTitle.length * 100}px` }" :sheet-title="Data.sheetTitle"
    :sheet-data="Data.sheetData" :begin-year="Data.params.beginTimeYear" :end-year="Data.params.endTimeYear"
  />

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
      <vxe-column field="dictValue" title="收支类型" width="100" />
      <vxe-column field="bankName" title="银行名称" width="200" />
      <vxe-column field="bankAccountNumber" title="银行账号" width="200" />
      <vxe-column field="eachAmount" title="收支金额" width="200" />
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
  background-color: rgba(252, 228, 214, 0.3) !important;
}

:deep(.yellow td) {
  background-color: rgba(255, 244, 204, 0.3) !important;
}

:deep(.blue td) {
  background-color: rgba(221, 235, 247, 0.3) !important;
}

:deep(.blue3 td) {
  background-color: rgba(214, 220, 228, 0.3) !important;
}

:deep(.green td) {
  background-color: rgba(226, 239, 218, 0.3) !important;
}

:deep(.vxe-body--expanded-cell) {
  padding-left: 80px !important;
}
</style>

