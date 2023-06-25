<script setup lang="ts">
import { NButton } from 'naive-ui'
import { subMatchApi } from '@/api/basisSetApi'
import { isNullOrUndef, showBtn } from '@/utils/common'
import { useAppStore } from '@/store'
import Export from '@/vendor/Export.js'
const props = defineProps<{
  buttons: string[]
  metaLength: number
  metaTitleLength: number
}>()
const appStore = useAppStore()

const tHeight = ref(appStore.tHeight - 330 + (props.metaTitleLength === 0 ? 42 : 0))

interface RowData {
  id: number
  idOne: number
  budSubjectBindingList: Array<any>
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
  },
  checkedRowKeys: [],
})
const instance = getCurrentInstance()
instance?.proxy?.$Bus.on('search', (searchValue: any) => {
  Data.page.pageNum = 1
  Data.params = { ...searchValue }
  initTableData()
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

instance?.proxy?.$Bus.on('exportsExcel', () => {
  exportsExcel()
})

// 导出
function exportData(arr) {
  const fields = [
    '预算科目编码',
    '发生额方向',
    '是否辅助核算',
    '会计科目编码',
    '余额方向',
    '部门编码',
    '部门名称',
  ]
  const filterVal = [
    'codeAndName',
    'budSubjectDirection',
    'ifAuxiliary',
    'accountantCodeAndName',
    'budAccountantSubjectDirection',
    'deptCode',
    'deptName',
  ]
  const data = arr.map(v => filterVal.map(j => v[j]))
  Export(data, fields, '科目匹配')
}

async function exportsExcel() {
  try {
    const arr: any = []
    if (xTable.value.getCheckboxRecords().length === 0) {
      window.$dialog?.warning({
        title: '确认导出全部？',
        negativeText: '取消',
        positiveText: '确认',
        onPositiveClick: async () => {
          const params = {
          }
          const res = await subMatchApi.getSubMatchList(params)
          res.data.list.forEach((item: any) => {
            let list = {}
            if (item.budSubjectBindingsChild.length === 0) {
              list = {
                codeAndName: item.codeAndName,
                budSubjectDirection: item.budSubjectDirection,
                ifAuxiliary: item.ifAuxiliary,
                accountantCodeAndName: item.accountantCodeAndName,
                budAccountantSubjectDirection: item.budAccountantSubjectDirection,
              }
              arr.push(list)
            }
            else {
              item.budSubjectBindingsChild.forEach((itemChildren: any, index) => {
                if (index === 0) {
                  list = {
                    codeAndName: item.codeAndName,
                    budSubjectDirection: item.budSubjectDirection,
                    ifAuxiliary: item.ifAuxiliary,
                    accountantCodeAndName: itemChildren.accountantCodeAndName,
                    budAccountantSubjectDirection: itemChildren.budAccountantSubjectDirection,
                    deptCode: itemChildren.deptCode,
                    deptName: itemChildren.deptName,
                  }
                  arr.push(list)
                }
                else {
                  list = {
                    deptCode: itemChildren.deptCode,
                    deptName: itemChildren.deptName,
                    budAccountantSubjectDirection: itemChildren.budAccountantSubjectDirection,
                    accountantCodeAndName: itemChildren.accountantCodeAndName,
                  }
                  arr.push(list)
                }
              })
            }
          })
          exportData(arr)
          window.$message?.success('导出成功')
        },
        onNegativeClick: () => {
          window.$message?.success('已取消')
        },
      })
    }
    else {
      xTable.value.getCheckboxRecords().forEach((item: any) => {
        let list = {}

        if (item.budSubjectBindingsChild.length === 0) {
          list = {
            codeAndName: item.codeAndName,
            budSubjectDirection: item.budSubjectDirection,
            ifAuxiliary: item.ifAuxiliary,
            accountantCodeAndName: item.accountantCodeAndName,
            budAccountantSubjectDirection: item.budAccountantSubjectDirection,
          }
        }
        else {
          item.budSubjectBindingsChild.forEach((itemChildren: any, index) => {
            if (index === 0) {
              list = {
                codeAndName: item.codeAndName,
                budSubjectDirection: item.budSubjectDirection,
                ifAuxiliary: item.ifAuxiliary,
                accountantCodeAndName: itemChildren.accountantCodeAndName,
                budAccountantSubjectDirection: itemChildren.budAccountantSubjectDirection,

                deptCode: itemChildren.deptCode,
                deptName: itemChildren.deptName,

              }
            }
            else {
              list = {
                deptCode: itemChildren.deptCode,
                deptName: itemChildren.deptName,
                budAccountantSubjectDirection: itemChildren.budAccountantSubjectDirection,
                accountantCodeAndName: itemChildren.accountantCodeAndName,
              }
            }
            arr.push(list)
          })
        }
      })

      exportData(arr)
      window.$message?.success('导出成功')
    }
  }
  catch (error) {
    console.error(error)
  }
}
onMounted(() => {
  initTableData()
})
async function initTableData() {
  loading.value = true
  try {
    Data.params.pageNum = Data.page.pageNum
    Data.params.pageSize = Data.page.pageSize
    const res = await subMatchApi.getSubMatchList(Data.params)
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

async function handleDelete(row: RowData) {
  if (isNullOrUndef(row.idOne))
    return
  window.$dialog?.warning({
    title: '确认删除？',
    negativeText: '取消',
    positiveText: '确认',
    onPositiveClick: async () => {
      const res = await subMatchApi.removeSubMatch({ id: row.idOne })
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

async function handleEdit(row: RowData) {
  instance?.proxy?.$Bus.emit('edit', row)
}
</script>

<template>
  <vxe-table ref="xTable" :loading="loading
  " border :tree-config="{
  indent: 16,
  trigger: 'cell',

}" :column-config="{ resizable: true }" :data="tableData" :height="tHeight" class="mytable-scrollbar">
    <vxe-column type="checkbox" width="60" fixed="left" />
    <vxe-column type="expand" title="" width="80" fixed="left">
      <template #content="{ row }">
        <vxe-table border :column-config="{ resizable: true }" :tree-config="{
          indent: 16,
          trigger: 'cell',
          expandAll: true,
        }" :data="row.budSubjectBindingsChild">
          <vxe-column type="seq" width="60" title="序号" />
          <vxe-column field="codeAndName" title="预算科目编码" width="250" />
          <vxe-column field="deptCode" title="部门编码" width="150" />
          <vxe-column field="deptName" title="部门名称" width="300" />
          <vxe-column field="accountantCodeAndName" title="会计科目编码" width="200" />
          <vxe-column field="budAccountantSubjectDirection" title="余额方向" width="250" />
        </vxe-table>
      </template>
    </vxe-column>

    <vxe-column type="seq" width="60" title="序号" />
    <vxe-column field="codeAndName" title="预算科目编码" width="250" />
    <vxe-column field="budSubjectDirection" title="发生额方向" width="150" />
    <vxe-column field="ifAuxiliary" title="是否辅助核算" width="300" />
    <vxe-column field="accountantCodeAndName" title="会计科目编码" width="200" />
    <vxe-column field="budAccountantSubjectDirection" title="余额方向" width="250" />
    <vxe-column field="" title="" width="200" />
    <vxe-table-column title="操作" width="200" show-overflow align="center" fixed="right">
      <template #default="scope">
        <NButton type="info" ml-10 mr-10 size="small" :hidden="!showBtn('编辑', props.buttons)"
          @click="handleEdit(scope.row)">
          编辑
        </NButton>
        <NButton type="error" ml-10 mr-10 size="small" :hidden="!showBtn('删除', props.buttons)"
          @click="handleDelete(scope.row)">
          删除
        </NButton>
      </template>
    </vxe-table-column>
  </vxe-table>
  <n-pagination v-model:page="Data.page.pageNum" v-model:page-size="Data.page.pageSize" :page-count="Data.page.totalPage"
    size="large" show-quick-jumper show-size-picker :page-sizes="[10, 20, 50, 100]" :on-update:page="pageChange"
    :on-update:page-size="pageSizeChange" f-r-r mt-10 />
</template>

