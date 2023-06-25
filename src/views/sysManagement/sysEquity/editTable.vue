<script setup lang="ts">
// import type { CascaderOption, DataTableColumns, FormInst, SelectOption } from 'naive-ui'
import type { CascaderOption, DataTableColumns, SelectOption } from 'naive-ui'
import { NButton, NSelect } from 'naive-ui'
import { Export } from '@/vendor/Export2Excel.js'
// import { renderIcon } from '@/utils/common'
// import { rules } from './common'
import { baseApi } from '@/api/baseApi'
import { useAppStore } from '@/store'
import { sysEquityApi } from '@/api/sysManaApi'
const appStore = useAppStore()
const tHeight = ref(appStore.tHeight - 310)

interface RowData {
  id: number
  deptId: number

}

interface col {
  columnsTitle: DataTableColumns<RowData>

}
const columns: col = reactive({
  columnsTitle: [
    { type: 'selection' },
    {
      title: '序号',
      align: 'center',
      width: 80,
      key: 'index',
      render: (_, index) => {
        return `${index + 1}`
      },
    },
    { title: '一级部门', key: 'deptName', align: 'center', width: 80, ellipsis: { tooltip: true } },

  ],
})
// const formRef = ref<FormInst | null>(null)
const loading = ref<boolean>(false)
const tableData = ref([
  {},
])

const Data = reactive({
  checkedRowKeys: [],
  index: 0,
  tableLength: 2,
  modalVisible: false,
  assetId: '',
  branchId: '',
  assetName: '',
  branchName: '',
  dept: [
    { deptId: '' },
  ],
  duty: [{
    dutyId: '',
    titleName: '',

  }],
  editData: {
  },
  mainData: {
    assetId: '',
    branchId: '',
    userDutys: [],
  },
  keyIndex: 0,

})

const instance = getCurrentInstance()

interface opt {
  deptOptions: CascaderOption[]
  approverOptions: SelectOption[]
  dutyOptions: SelectOption[]
  billTypeOptions: SelectOption[]
  branchOptions: CascaderOption[]
}
const options: opt = reactive({
  deptOptions: [],
  approverOptions: [],
  dutyOptions: [],
  billTypeOptions: [],
  branchOptions: [],
})

async function fetchUserList() {
  const res = await baseApi.fetchProcessUserList({})
  options.approverOptions = res.data
}
async function fetchTitleData() {
  const res = await sysEquityApi.getHeaderTitle({})
  if (res.code === 200) {
    Data.tableLength = Data.tableLength + res.data.length
    columns.columnsTitle = [
      { type: 'selection' },
      {
        title: '序号',
        align: 'center',
        width: 80,
        key: 'index',
        fixed: 'left',
        render: (_, index) => {
          return `${index + 1}`
        },
      },
      { title: '一级部门', fixed: 'left', key: 'deptName', align: 'center', width: 120, ellipsis: { tooltip: true } },

    ]
    res.data.forEach((item, index) => {
      Data.duty[index] = ({ dutyId: item.dutyId, titleName: item.titleName })
      columns.columnsTitle.push({
        title: `${item.dutyName}`,
        key: `'${item.titleName}'`,
        align: 'center',
        width: 180,
        ellipsis: { tooltip: true },
        render(row, index) {
          const arr: any = [
          ]
          if (row[`${item.titleName}`]) {
            row[`${item.titleName}`].forEach((item) => {
              arr.push(item.userId)
            })
          }
          return [
            h(
              NSelect, {
                style: {
                  width: '150px',
                },
                multiple: true,
                value: arr,
                labelField: 'linkmanName',
                valueField: 'userId',
                disabled: item.dutyName === '会计' || item.dutyName === '财务经理' || item.dutyName === '财务总监' || item.dutyName === '财务分管领导' || item.dutyName === '审批人' || item.dutyName === '出纳',
                options: options.approverOptions,
                onUpdateValue(v: any) {
                  (tableData.value as any)[index][`${item.titleName}`] = []
                  v.forEach((vitem, vindex) => {
                    (tableData.value as any)[index][`${item.titleName}`].push({ userId: vitem })
                  })
                },
              },
            ),
          ]
        },
      })
    })
  }
}

async function fetchData(key1) {
  loading.value = true
  const res = await sysEquityApi.getHeaderTitleContent({ assetId: key1 })
  if (res.code === 200) {
    res.data.forEach((item, index) => {
      Data.dept[index] = { deptId: item.deptId }
    })
    tableData.value = res.data
  }
  loading.value = false
}
async function editMsg(type: number) {
  if (type === 1) {
    Data.mainData.assetId = Data.assetId
    Data.mainData.branchId = Data.branchId
    Data.mainData.userDutys = []
    for (let i = 0; i < tableData.value.length; i++) {
      for (const key in tableData.value[i]) {
        if (key !== 'deptName' && key !== 'deptId') {
          // Data.index = Data.index + 1
          if (JSON.stringify(tableData.value[i][key]) !== '[]') {
            for (let j = 0; j < Data.duty.length; j++) {
              if (Data.duty[j].titleName === key) {
                tableData.value[i][key].forEach((item: never, index) => {
                  Object.assign(item, { dutyId: Data.duty[j].dutyId }, Data.dept[i])
                  Data.mainData.userDutys.push(item)
                })
              }
            }
          }
        }
      }
    }

    const res = JSON.stringify(Data.editData) === '{}'
      ? await sysEquityApi.addUserAssetList(
        Data.mainData,
      )
      : await sysEquityApi.saveEditEquity(
        Data.mainData,
      )
    if (res.code === 200) {
      window.$notification?.success({ title: '保存成功！', duration: 2500 })
      Data.modalVisible = false
      // Data.index = 0
    }
    else {
      Data.index = 0
      window.$notification?.warning({ title: `${res.message}`, duration: 2500 })
    }

    // }
  }

  else if (type === 0) { Data.modalVisible = false }
}

async function importHandle(ev) {
  try {
    const formdata = new FormData()
    formdata.append('file', ev.file.file)
    formdata.append('name', 'userDuty')
    loading.value = true
    const res = await baseApi.importFile(formdata)
    if (res.code === 200) {
      window.$message?.success('导入成功')
      // searchHandle()
      fetchData(Data.assetId)
      loading.value = false
    }
    else {
      window.$message?.error(`${res.message}`)
      loading.value = false
    }
  }
  catch (error) {
    console.error(error)
    loading.value = false
    // searchHandle()
  }
}

// 导出
function exportData(arr) {
  const fields = [
    '组织架构',
    '产权结构',
    '部门',
    '职位',
    '用户',

  ]
  const filterVal = [
    'branchName',
    'assetName',
    'deptName',
    'dutyName',
    'linkmanName',
  ]

  const data = arr.map(v => filterVal.map(j => v[j]))
  Export(data, fields, '产权结构审批角色')
}
async function exportHandle() {
  try {
    instance?.proxy?.$Bus.emit('loading', true)
    // Data.isExport = true
    const arr: any = [
    ]
    if (Data.checkedRowKeys.length === 0) {
      window.$dialog?.warning({
        title: '确认导出全部？',
        negativeText: '取消',
        positiveText: '确认',
        onPositiveClick: async () => {
          tableData.value.forEach((item: any, index) => {
            for (const key in item) {
              columns.columnsTitle.forEach((colItem: any) => {
                if (`'${key}'` === colItem.key) {
                  if (item[key].length !== 0) {
                    item[key].forEach((childItem: any) => {
                      arr.push({ branchName: Data.branchName, assetName: Data.assetName, deptName: item.deptName, dutyName: colItem.title, linkmanName: childItem.linkmanName })
                    })
                  }
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

      // const excel = await import('@/vendor/Export2Excel')
    }
    else {
      tableData.value.forEach((item: { deptId: number; deptName: string }) => {
        Data.checkedRowKeys.forEach((itemChildren: number) => {
          if (itemChildren === item.deptId) {
            for (const key in item) {
              columns.columnsTitle.forEach((colItem: { key: string; title: string }) => {
                if (`'${key}'` === colItem.key) {
                  if (item[key].length !== 0) {
                    item[key].forEach((childItem: { linkmanName: string }) => {
                      arr.push(
                        {
                          branchName: Data.branchName,
                          assetName: Data.assetName,
                          deptName: item.deptName,
                          dutyName: colItem.title,
                          linkmanName: childItem.linkmanName,
                        })
                    })
                  }
                }
              })
            }
          }
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
onMounted(() => {
  instance?.proxy?.$Bus.on('editTable', (row: any) => {
    fetchUserList()
    Data.index = 0
    Data.tableLength = 2
    if (row) {
      Data.branchId = row.branchId
      Data.assetId = row.assetId
      Data.branchName = row.branchName
      Data.assetName = row.assetName
      fetchData(Data.assetId)
      fetchTitleData()
    }
    else {
      Data.editData = {}
    }
    Data.modalVisible = !Data.modalVisible
  })
})
</script>

<template>
  <n-modal
    v-model:show="Data.modalVisible" class="custom-card" preset="card" title="审批角色管理" size="huge"
    :style="{ width: '180vh' }"
  >
    <n-card mt-10>
      <n-layout-header flex mb-20>
        <n-space flex-1 m-auto text-16 font-600>
          数据
        </n-space>
        <n-space m-auto min-w-180>
          <n-upload :show-file-list="false" @change="importHandle">
            <NButton type="info" :loading="loading">
              <template #icon>
                <icon-mingcute:file-import-line />
              </template>
              导入
            </NButton>
          </n-upload>
          <NButton type="info" :loading="loading" @click="exportHandle">
            <template #icon>
              <icon-uil:file-import />
            </template>
            导出
          </NButton>
        </n-space>
      </n-layout-header>
      <n-scrollbar x-scrollable>
        <n-data-table
          v-model:checked-row-keys="Data.checkedRowKeys" default-expand-all single-column striped
          :columns="columns.columnsTitle" :row-key="(row: RowData) => row.deptId" :data="tableData" :loading="loading"
          flex-height :style="{ minHeight: `${tHeight}px` }"
        />
      </n-scrollbar>
    </n-card>

    <template #footer>
      <NLayout text-center>
        <NButton type="info" mr-10 @click="editMsg(1)">
          保存
        </NButton>
        <NButton type="info" ml-10 @click="editMsg(0)">
          取消
        </NButton>
      </NLayout>
    </template>
  </n-modal>
</template>

<style scoped>

</style>
