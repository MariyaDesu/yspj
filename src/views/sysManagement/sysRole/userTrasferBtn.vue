<script setup lang="ts">
import type { DataTableColumns } from 'naive-ui'
import { NButton, NCheckbox } from 'naive-ui'
import { sysRoleApi } from '@/api/sysManaApi'
import { useAppStore } from '@/store'

const appStore = useAppStore()

const tHeight = ref(appStore.tHeight - 310)
const tableData = ref()
const isEnable = ref(0)
interface RowData {
  menuId: string
  title: string
  buttons: Array<any>
  status: number
}

const columns: DataTableColumns<RowData> = [
  {
    title: '序号',
    align: 'center',
    width: 80,
    key: 'key',
    render: (_, index) => {
      return `${index + 1}`
    },
  },

  {
    title: '菜单名称',
    key: 'title',
    align: 'left',
    width: 300,
    // ellipsis: { tooltip: true },
    render(row, index) {
      return h(
        NCheckbox,
        {
          size: 'small',
          type: 'info',
          label: row.title,
          checked: row.status,
          checkedValue: 1,
          uncheckedValue: 0,
          onUpdateChecked(v) {
            tableData.value[index].buttons.forEach((item) => {
              item.status = v
            })
            tableData.value[index].status = v
          },
        },
      )
    },

  },
  {
    title: '功能列表',
    key: 'buttons',
    align: 'left',
    width: 500,
    render(row, index) {
      const arr: Array<any> = []
      row.buttons.forEach((item: any, indexItem) => {
        arr.push(
          h(
            NCheckbox,
            {
              size: 'small',
              type: 'info',
              label: item.buttonText,
              checked: item.status,
              checkedValue: 1,
              uncheckedValue: 0,
              onUpdateChecked(v) {
                isEnable.value = 0
                tableData.value[index].buttons[indexItem].status = v
                for (let i = 0; i < tableData.value[index].buttons.length; i++) {
                  if (tableData.value[index].buttons[i].status === 1)
                    isEnable.value++
                }
                if (isEnable.value === tableData.value[index].buttons.length)
                  tableData.value[index].status = 1
                else
                  tableData.value[index].status = 0
              },
              // defaultChecked: item.IsAuth,
            },
          ),

        )
      })
      return arr
    },
  },
]
interface dataType {
  roleId: string
  showTransfer: boolean
  options: Array<any>
  value: Array<any>
  checkedRowKeys: Array<any>
}
const Data: dataType = reactive({
  roleId: '',
  showTransfer: false,
  options: [],
  value: [],
  checkedRowKeys: [],
})
const loading = ref<boolean>(false)

const instance = getCurrentInstance()
function fetchTableData() {
  instance?.proxy?.$Bus.emit('fetchData')
}
instance?.proxy?.$Bus.on('trasferBtn', (row: any) => {
  Data.showTransfer = !Data.showTransfer
  Data.value = []
  Data.roleId = row.row.roleId
  tableData.value = row.userTrasfertableData
})

async function editMsg(type: number) {
  if (type === 1) {
    const userList: any = {
      roleId: Data.roleId,
      menuButtons: [],
    }
    tableData.value.forEach((item) => {
      item.buttons.forEach((itemChildRen) => {
        if (itemChildRen.status === 1)
          userList.menuButtons.push({ menuId: itemChildRen.menuId, buttonId: itemChildRen.buttonId })
      })
    })

    const res: any = await sysRoleApi.addRoleMenuButton(userList)
    if (res.code === 200) {
      window.$notification?.success({ title: '保存成功！', duration: 2500 })
      Data.showTransfer = false
    }
    else {
      window.$notification?.warning({ title: `${res.message}`, duration: 2500 })
    }
    fetchTableData()
  }
  else if (type === 0) {
    Data.showTransfer = false
  }
}
</script>

<template>
  <n-modal
    v-model:show="Data.showTransfer" class="custom-card" preset="card" title="分配权限" size="huge"
    :style="{ width: '80vw', height: '100%' }"
  >
    <n-data-table
      single-column striped :columns="columns"
      :row-key="(row: RowData) => row.menuId" :data="tableData" :loading="loading" flex-height
      :style="{ minHeight: `${tHeight}px` }"
    />
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
