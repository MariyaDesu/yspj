<script setup lang="ts">
import type { CascaderOption, FormInst, SelectOption } from 'naive-ui'
import { rules } from './common'
import { budgetEntryApi } from '@/api/budgetApi'
import { useBaseApiListStore } from '@/store'
const baseApiListStore = useBaseApiListStore()
interface IOption {
  menuOptions: CascaderOption[] // 预算科目
  budBalanceDirectionOptions: SelectOption[] // 余额方向
}
interface IMainData {
  code?: string
  name?: string
  id?: number
  parentId?: number | null
  budBalanceDirection?: string
  instructions?: string
}
interface IData {
  modalVisible?: boolean
  editData?: object
  mainData: IMainData
}
const Data: IData = reactive({
  modalVisible: false,
  editData: {},
  mainData: {},
})
const instance = getCurrentInstance()
const formRef = ref<FormInst | null>(null)
const editMsg = async () => {
  formRef.value?.validate(async (errors) => {
    if (!errors) {
      // 没有上级目录 给parentId 赋值0
      if (Data.mainData.parentId === null)
        Data.mainData.parentId = 0

      const res = JSON.stringify(Data.editData) === '{}'
        ? await budgetEntryApi.saveAddBudgetEntry(
          Data.mainData,
        )
        : await budgetEntryApi.saveEditBudgetEntry(
          Data.mainData,
        )
      if (res.code === 200) {
        window.$notification?.success({ title: '保存成功！', duration: 2500 })
        Data.modalVisible = false
        fetchMenuTable()
        fetchTableData(Data.mainData.parentId === 0 ? Data.mainData.id : Data.mainData.parentId)
      }
      else {
        window.$notification?.error({ title: res.message, duration: 2500 })
      }
    }
    else {
      window.$message?.error('请填写必填项')
    }
  })
}
function fetchTableData(id) {
  instance?.proxy?.$Bus.emit('fetchBudEntryTableData', id)
}

function fetchMenuTable() {
  instance?.proxy?.$Bus.emit('fetchMenuTableData')
}

const options: IOption = reactive({
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
onMounted(() => {
  instance?.proxy?.$Bus.on('edit', (row: IMainData) => {
    if (JSON.stringify(row) === '{}') {
      Data.mainData = {}
      Data.editData = {}
    }
    // 编辑
    else {
      Data.editData = row
      Data.mainData = {}
      Object.assign(Data.mainData, Data.editData)
      if (Data.mainData.parentId === 0)
        Data.mainData.parentId = null
    }
    options.menuOptions = baseApiListStore.budAccountInfo
    Data.modalVisible = true
  })
})
</script>

<template>
  <n-modal
    v-model:show="Data.modalVisible" class="custom-card" preset="card"
    :title="`${JSON.stringify(Data.editData) === '{}' ? '新增' : '编辑'}预算科目`" size="huge" :style="{ width: '50vw' }"
  >
    <n-form ref="formRef" label-placement="top" :rules="rules" :model="Data.mainData" label-width="140">
      <n-form-item label="预算科目类别代码" path="code">
        <n-input v-model:value="Data.mainData.code" clearable placeholder="请输入" />
      </n-form-item>
      <n-form-item label="预算科目类别名称" path="name">
        <n-input v-model:value="Data.mainData.name" clearable placeholder="请输入" />
      </n-form-item>
      <n-form-item label="目录" path="parentId">
        <n-cascader
          v-model:value="Data.mainData.parentId" label-field="budSubjectName" value-field="budSubjectId"
          :disabled="JSON.stringify(Data.editData) !== '{}'" children-field="children" :options="options.menuOptions" clearable
        />
      </n-form-item>
      <n-form-item label="余额方向" path="budBalanceDirection">
        <n-select
          v-model:value="Data.mainData.budBalanceDirection" label-field="balanceDirectionName"
          value-field="budBalanceDirection" filterable :options="options.budBalanceDirectionOptions" placeholder="请选择"
          clearable
        />
      </n-form-item>
      <n-form-item label="说明">
        <n-input v-model:value="Data.mainData.instructions" clearable placeholder="请输入" />
      </n-form-item>
    </n-form>
    <template #footer>
      <NLayout text-center>
        <NButton type="info" mr-10 @click="editMsg">
          保存
        </NButton>
        <NButton type="info" ml-10 @click="Data.modalVisible = false">
          取消
        </NButton>
      </NLayout>
    </template>
  </n-modal>
</template>

<style scoped></style>
