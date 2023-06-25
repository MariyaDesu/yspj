<script setup lang="ts">
import type { FormInst, SelectOption } from 'naive-ui'
import { rules } from './common'
import { formatSelectDrop } from '@/utils/common/dropDown'
import { sysPaymentApi } from '@/api/sysManaApi'
import { baseApi } from '@/api/baseApi'
interface list {
  bankName?: string
  bankAccountNumber?: string
  flag?: number

  branchId?: string
  assetId?: string
  bankType?: string

}
interface dataList {
  modalVisible: boolean
  editData: object
  mainData: list
}
const Data = reactive<dataList>({
  modalVisible: false,
  editData: {},
  mainData: {
    flag: 0,

  },
})

interface IOption {
  assetOptions: SelectOption[]
  deptStateOptions: SelectOption[]
}

const options: IOption = reactive({
  assetOptions: [],
  deptStateOptions: [],
})

const instance = getCurrentInstance()
function fetchTableData() {
  instance?.proxy?.$Bus.emit('fetchData')
}

async function fetchAssetOptionsList() {
  const res = await baseApi.getAssetAllList({})
  options.assetOptions = res.data
  formatSelectDrop(options.assetOptions)
}

async function fetchDeptState() {
  const res = await baseApi.getBranchAllList({})
  options.deptStateOptions = res.data
  formatSelectDrop(options.deptStateOptions)
}

const formRef = ref<FormInst | null>(null)
async function editMsg() {
  formRef.value?.validate(async (errors) => {
    if (!errors) {
      const res = JSON.stringify(Data.editData) === '{}'
        ? await sysPaymentApi.saveAddPayment(
          Data.mainData,
        )
        : await sysPaymentApi.saveEditPayment(
          Data.mainData,
        )

      if (res.code === 200) {
        window.$notification?.success({ title: '保存成功！', duration: 2500 })
        Data.modalVisible = false
        fetchTableData()
      }

      else { window.$notification?.warning({ title: `${res.message}`, duration: 2500 }) }
    }
    else {
      window.$message?.error('请填写必填项')
    }
  })
}

onMounted(() => {
  instance?.proxy?.$Bus.on('edit', (row: any) => {
    row ? Data.editData = JSON.parse(JSON.stringify(row)) : Data.editData = {}
    Data.modalVisible = !Data.modalVisible
    Data.mainData = {
      flag: 0,
    }
    Object.assign(Data.mainData, Data.editData)
    fetchAssetOptionsList()
    fetchDeptState()
  })
  // fetchAreaList()
})
</script>

<template>
  <n-modal
    v-model:show="Data.modalVisible" class="custom-card" preset="card"
    :title="`${JSON.stringify(Data.editData) === '{}' ? '新增' : '编辑'}支付方式`" size="huge"
    :style="{ width: '50vw' }"
  >
    <n-form
      ref="formRef" label-placement="top" :model="Data.mainData" label-width="120" require-mark-placement="left"
      :rules="rules"
    >
      <n-form-item label="产权结构名称" span="5" path="assetId">
        <NSelect
          v-model:value="Data.mainData.assetId" label-field="assetName" value-field="assetId" filterable
          :options="options.assetOptions" placeholder="请选择" clearable children-field="children"
          @click="fetchAssetOptionsList"
        />
      </n-form-item>
      <n-form-item label="管理结构名称" path="branchId">
        <NSelect
          v-model:value="Data.mainData.branchId" filterable :options="options.deptStateOptions"
          label-field="branchName" value-field="branchId" placeholder="请选择" clearable @click="fetchDeptState"
        />
      </n-form-item>
      <n-form-item label="银行名称" path="bankName">
        <n-input v-model:value="Data.mainData.bankName" clearable placeholder="请输入" />
      </n-form-item>
      <n-form-item label="银行账号" path="bankAccountNumber">
        <n-input v-model:value="Data.mainData.bankAccountNumber" clearable placeholder="请输入" />
      </n-form-item>

      <n-form-item label="是否启用" path="string">
        否
        <n-switch v-model:value="Data.mainData.flag" default-value="Data.mainData.flag" ml-5 mr-5 :checked-value="0" :unchecked-value="1" />
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
