<script setup lang="ts">
import type { CascaderOption, SelectOption } from 'naive-ui'
import { accountSubApi } from '@/api/basisSetApi'
// import { baseApi } from '@/api/baseApi'
import { useBaseApiListStore } from '@/store'
const baseApiListStore = useBaseApiListStore()
interface mainDataObj {
  parentId?: number | null
  code?: string
  originalCode?: string
  name?: string
  id?: number
  balanceDirection?: string
  instructions?: string
}

interface data {
  modalVisible?: boolean
  keyValue?: number
  editData?: object
  mainData: mainDataObj
}
const Data: data = reactive({
  modalVisible: false,
  editData: {},
  mainData: {},
})
const instance = getCurrentInstance()
const editMsg = async (type: number) => {
  if (type === 1) {
    const res = JSON.stringify(Data.editData) === '{}'
      ? await accountSubApi.saveAddBudgetEntry(
        Data.mainData,
      )
      : await accountSubApi.saveEditBudgetEntry(
        Data.mainData,

      )
    if (res.code === 200) {
      window.$notification?.success({ title: '保存成功！', duration: 2500 })
      fetchMenuTable()
      fetchTableData(Data.mainData.parentId === 0 ? Data.mainData.id : Data.mainData.parentId)
      // fetchTableData()
      Data.modalVisible = false
      // fetchBudgetEntryMenu()
    }
    else {
      window.$notification?.error({ title: res.message, duration: 2500 })
    }
  }
  else if (type === 0) { Data.modalVisible = false }
}
function fetchTableData(id) {
  instance?.proxy?.$Bus.emit('fetchBudEntryTableData', id)
}

interface opt {
  menuOptions: CascaderOption[]
  budBalanceDirectionOptions: SelectOption[]
}
const options: opt = reactive({
  menuOptions: [],
  budBalanceDirectionOptions: [
    {
      balanceDirectionName: '借',
      budBalanceDirection: 0,
    },
    {
      balanceDirectionName: '贷',
      budBalanceDirection: 1,
    },
  ],
})
function fetchMenuTable() {
  instance?.proxy?.$Bus.emit('fetchMenuTableData')
}

onMounted(() => {
  instance?.proxy?.$Bus.on('edit', (row: any) => {
    // 新增
    if (row.type) {
      Data.mainData = {}
      Data.editData = {}
    }
    // 编辑
    else {
      Data.editData = row.keyVal
      Data.mainData = {}
      Object.assign(Data.mainData, Data.editData)
      Data.mainData.originalCode = row.keyVal.code
    }
    options.menuOptions = baseApiListStore.accountSubInfo
    Data.modalVisible = !Data.modalVisible
  })
})
</script>

<template>
  <n-modal
    v-model:show="Data.modalVisible" class="custom-card" preset="card"
    :title="`${JSON.stringify(Data.editData) === '{}' ? '新增' : '编辑'}会计科目`" size="huge" :style="{ width: '50vw' }"
  >
    <n-form ref="formRef" label-placement="top" :model="Data.mainData" label-width="140">
      <n-form-item label="会计科目代码">
        <n-input v-model:value="Data.mainData.code" clearable placeholder="请输入" />
      </n-form-item>
      <n-form-item label="会计科目名称">
        <n-input v-model:value="Data.mainData.name" clearable placeholder="请输入" />
      </n-form-item>
      <n-form-item label="目录" path="parentId">
        <n-cascader
          v-model:value="Data.mainData.parentId" label-field="accountantSubjectName"
          value-field="accountantSubjectId" children-field="children" :options="options.menuOptions"
          :disabled="JSON.stringify(Data.editData) !== '{}'"
        />
      </n-form-item>
      <n-form-item label="余额方向" path="balanceDirection">
        <n-select
          v-model:value="Data.mainData.balanceDirection" label-field="balanceDirectionName"
          value-field="budBalanceDirection" filterable :options="options.budBalanceDirectionOptions" placeholder="请选择"
        />
      </n-form-item>
      <n-form-item label="说明">
        <n-input v-model:value="Data.mainData.instructions" clearable placeholder="请输入" />
      </n-form-item>
    </n-form>
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

<style scoped></style>
