<script setup lang="ts">
import { budgetReportApi } from '@/api/budgetReportApi'
import { useAppStore } from '@/store'
const props = defineProps<{
  metaTitleLength: number
}>()

const appStore = useAppStore()

const tHeight = ref(appStore.tHeight - 340 + (props.metaTitleLength === 0 ? 42 : 0))

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
    budgetOrExecute: 1,
  },
})
const instance = getCurrentInstance()
instance?.proxy?.$Bus.off('search')
instance?.proxy?.$Bus.off('fetchData')
onBeforeMount(() => {
  instance?.proxy?.$Bus.on('search', (searchValue: any) => {
    Data.page.pageNum = 1
    Data.params = { ...searchValue }
    Data.params.budgetOrExecute = 1
    initTableData()
  })
  instance?.proxy?.$Bus.on('fetchData', () => {
    initTableData()
  })
  initTableData()
})

onUnmounted(() => {
  // instance?.proxy?.$Bus.off('search')
  // instance?.proxy?.$Bus.off('fetchData')
})
async function initTableData() {
  loading.value = true
  try {
    Data.params.pageNum = Data.page.pageNum
    Data.params.pageSize = Data.page.pageSize
    Data.params.budgetOrExecute = 1
    const res = await budgetReportApi.fetchDeptReport(Data.params)
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

// function rowClassName(row): any {
//   if (row.row.hierarchy === 0) {
//     return {
//       backgroundColor: 'rgba(221, 235, 247, 0.3)',
//     }
//   }
//   else if (row.row.hierarchy === 1) { return { backgroundColor: 'rgba(255, 244, 204, 0.3)' } }
//   else if (row.row.hierarchy === 2) { return { backgroundColor: 'rgba(226, 239, 218, 0.3)' } }
//   else if (row.row.hierarchy === 3) { return { backgroundColor: 'rgba(252, 228, 214, 0.3)' } }
//   return { backgroundColor: 'rgba(214, 220, 228, 0.3)' }
// }

function rowClassName(row): any {
  if (row.row.hierarchy === 0) {
    return {
      backgroundColor: 'rgba(221, 235, 247, 0.3)',
    }
  }
  else if (row.row.hierarchy === 1) { return { backgroundColor: 'rgba(226, 239, 218, 0.3)' } }
  // else if (row.row.hierarchy === 2) { return { backgroundColor: 'rgba(226, 239, 218, 0.3)' } }
  // else if (row.row.hierarchy === 3) { return { backgroundColor: 'rgba(252, 228, 214, 0.3)' } }
  return { backgroundColor: 'rgba(214, 220, 228, 0.3)' }
}

function rowExpandClassName(row): any {
  if (row.row.hierarchy === 0) {
    return {
      backgroundColor: 'rgba(255, 244, 204, 0.3)',
    }
  }
  else if (row.row.hierarchy === 1) { return { backgroundColor: 'rgba(252, 228, 214, 0.3)' } }
  return { backgroundColor: 'white' }
}

const expandConfig = ref({
  visibleMethod({ row }) {
    if (row.statementDetailList.length === 0)
      return false
    return true
  },
})
</script>

<template>
  <vxe-table
    :loading="loading"
    border :column-config="{ resizable: true }" :tree-config="{
      children: 'statementList',
      trigger: 'cell',

    }" :expand-config="expandConfig" :row-style="rowClassName" :data="tableData" :height="tHeight" class="mytable-scrollbar"
  >
    <vxe-column type="expand" title="" width="80">
      <template #content="{ row }">
        <vxe-table
          border :column-config="{ resizable: true }" :tree-config="{

            trigger: 'cell',
            expandAll: true,
          }" :data="row.statementDetailList"
          :row-style="rowExpandClassName"
        >
          <vxe-column type="expand" title="" width="80">
            <template #content="{ row }">
              <vxe-table
                border :column-config="{ resizable: true }" :tree-config="{

                  trigger: 'cell',
                  expandAll: true,
                }" :data="row.statementDetailList"
                :row-style="rowExpandClassName"
              >
                <vxe-column type="expand" title="" width="80">
                  <template #content="{ row }">
                    <vxe-table
                      border :column-config="{ resizable: true }" :tree-config="{
                        trigger: 'cell',
                        expandAll: true,
                      }" :data="row.statementDetailList"
                      :row-style="rowExpandClassName"
                    >
                      <vxe-column
                        type="seq" width="520" title="序号" align="left"
                      />
                      <vxe-column field="matter" title="预算事项明细" width="200" />
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
                    </vxe-table>
                  </template>
                </vxe-column>
                <vxe-column
                  type="seq" width="320" title="序号"
                />
                <vxe-column field="contractStateName" title="合同状态名称" width="200" />
                <vxe-column field="matter" title="预算事项明细" width="200" />
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
              </vxe-table>
            </template>
          </vxe-column>
          <vxe-column
            type="seq" width="200" title="序号"
          />
          <vxe-column field="projectName" title="立项名称" width="200" />
          <vxe-column field="contractStateName" title="合同状态名称" width="200" />
          <vxe-column field="matter" title="预算事项明细" width="200" />
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
          <!-- <template v-for="item in columns.titleColumns" :key="item.key">
            <vxe-column :field="item.field" :title="item.title" />
          </template> -->
        </vxe-table>
      </template>
    </vxe-column>

    <vxe-column type="seq" width="80" title="序号" />
    <vxe-column field="deptName" title="部门名称" width="200" tree-node />
    <vxe-column field="projectName" title="立项名称" width="200" />
    <vxe-column field="contractStateName" title="合同状态名称" width="200" />
    <vxe-column field="matter" title="预算事项明细" width="200" />
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
:deep(.vxe-body--expanded-cell) {
  padding-left: 80px !important;
}
</style>

