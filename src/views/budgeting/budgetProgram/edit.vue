<script setup lang="ts">
import type { FormInst, SelectOption } from 'naive-ui'
import { rules } from './common'
import type { budgetProgramEdit } from './interface'
import { budgetProgramApi } from '@/api/budgetApi'
import { useBaseApiListStore } from '@/store'

const baseApiListStore = useBaseApiListStore()
const Data = reactive<budgetProgramEdit.IData>({
  modalVisible: false,
  editData: {},
  mainData: {},
  isDisable: false,
})
const formRef = ref<FormInst | null>(null)
const userTypeOptions: SelectOption[] = reactive([
  {
    typeId: 1,
    typeName: '期',
  },
  {
    typeId: 2,
    typeName: '季',
  },
  {
    typeId: 3,
    typeName: '年',
  },
])

const instance = getCurrentInstance()

function fetchTableData() {
  instance?.proxy?.$Bus.emit('fetchData')
}
// 保存
async function editMsg() {
  formRef.value?.validate(async (errors) => {
    if (!errors) {
      const res = JSON.stringify(Data.editData) === '{}'
        ? await budgetProgramApi.saveAddBudProgrammer(
          Data.mainData,
        )
        : await budgetProgramApi.saveEditBudProgrammer(
          Data.mainData,
        )
      if (res.code === 200) {
        window.$notification?.success({ title: '保存成功！', duration: 2500 })
        await baseApiListStore.getselectCurrent()
        fetchTableData()
        Data.modalVisible = false
      }
      else { window.$notification?.warning({ title: `${res.message}`, duration: 2500 }) }
    }
    else {
      window.$message?.error('请填写必填项')
    }
  })
}

onMounted(() => {
  instance?.proxy?.$Bus.on('edit', (row) => {
    row ? Data.editData = JSON.parse(JSON.stringify(row)) : Data.editData = {}
    Data.modalVisible = !Data.modalVisible
    Data.isDisable = JSON.stringify(Data.editData) !== '{}'
    // 数据初始化 默认年 12期 非滚动预算
    Data.mainData = {
      type: 3,
      beginPeriod: 12,
      scrollBudget: '0',
    }
    Object.assign(Data.mainData, Data.editData)
  })
})
</script>

<template>
  <n-modal
    v-model:show="Data.modalVisible" class="custom-card" preset="card"
    :title="`${JSON.stringify(Data.editData) === '{}' ? '新增' : '编辑'}预算方案`" size="huge"
    :style="{ width: '50vw' }"
  >
    <n-form ref="formRef" label-placement="top" :model="Data.mainData" label-width="120" :rules="rules" require-mark-placement="left">
      <n-form-item label="方案代码" path="code">
        <n-input v-model:value="Data.mainData.code" clearable placeholder="请输入" :disabled="Data.isDisable" />
      </n-form-item>
      <n-form-item label="方案名称" path="name">
        <n-input v-model:value="Data.mainData.name" clearable placeholder="请输入" />
      </n-form-item>
      <n-form-item label="预算期间定义" path="type">
        <n-select
          v-model:value="Data.mainData.type"
          :disabled="Data.isDisable" label-field="typeName" value-field="typeId" filterable
          :options="userTypeOptions" placeholder="请选择" :default-value="Data.mainData.type"
        />
      </n-form-item>
      <n-form-item label="方案开始" path="beginYear">
        <n-date-picker
          v-model:formatted-value="Data.mainData.beginYear"
          value-format="yyyy"
          type="year"
          clearable
          placeholder="请输入" :disabled="Data.isDisable"
          :style="{ width: '100%' }"
        />
      </n-form-item>
      <n-form-item label="期" path="beginPeriod">
        <n-input-number
          v-model:value="Data.mainData.beginPeriod" clearable
          wh-full
          placeholder="请输入"
          :show-button="false" :disabled="Data.isDisable"
        />
      </n-form-item>
      <n-form-item label="制定日期" path="formulateDate">
        <n-date-picker
          v-model:formatted-value="Data.mainData.formulateDate"
          value-format="yyyy-MM-dd"
          type="date"
          clearable
          placeholder="请输入" :disabled="Data.isDisable"
          :style="{ width: '100%' }"
        />
      </n-form-item>
      <n-form-item label="滚动预算" path="scrollBudget">
        否
        <n-switch
          v-model:value="Data.mainData.scrollBudget" ml-5 mr-5 :checked-value="1"
          :unchecked-value="0" :disabled="Data.isDisable"
        />
        是
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

<style scoped>

</style>
