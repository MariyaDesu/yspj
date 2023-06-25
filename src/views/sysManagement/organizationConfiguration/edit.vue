<script setup lang="ts">
import type { CascaderOption, FormInst, SelectOption } from 'naive-ui'
import { rules } from './common'
import { organApi } from '@/api/basisSetApi'
import { baseApi } from '@/api/baseApi'
import { formatDrop } from '@/utils/common/dropDown'
interface list {
  branchId?: number
  parentId?: number | null
  branchCode?: string
  branchName?: string
  branchType?: number
  parentBranchCode?: string
  branchBusType?: number
  legalRepresentative?: string
  tell?: string
  fax?: string
  bankNo?: string
  taxNo?: string
  emailBox?: string
  bankId?: number
  bankName?: string
}
interface mainList {
  mainData: list
  editData: object
  modalVisible: boolean
}

const Data = reactive<mainList>({
  modalVisible: false,
  editData: {},
  mainData: {},
})

const formRef = ref<FormInst | null>(null)
const instance = getCurrentInstance()
interface IOption {
  branchTypeOptions: SelectOption[]
  bankBusNameOptions: SelectOption[]
  parentBranchOptions: CascaderOption[]
}
const options: IOption = reactive({
  branchTypeOptions: [],
  bankBusNameOptions: [],
  parentBranchOptions: [],
})
// 刷新表格
function fetchTableData() {
  instance?.proxy?.$Bus.emit('fetchData')
}

// 保存
const editMsg = async () => {
  formRef.value?.validate(async (errors) => {
    if (!errors) {
      if (Data.mainData.parentId === null)
        Data.mainData.parentId = 0
      const res = JSON.stringify(Data.editData) === '{}'
        ? await organApi.saveAddOrgan(
          Data.mainData,
        )
        : await organApi.saveEditOrgan(
          Data.mainData,
        )
      if (res.code === 200) {
        window.$notification?.success({ title: '保存成功！', duration: 2500 })
        fetchTableData()
        Data.modalVisible = false
      }
      else {
        window.$notification?.warning({ title: `${res.message}`, duration: 2500 })
      }
    }
    else {
      window.$message?.error('请填写必填项')
    }
  })
}

// 获取管理结构
async function fetchBranch() {
  const res = await baseApi.fetchBranch({})
  formatDrop(res.data)
  options.parentBranchOptions = res.data
}

onMounted(() => {
  instance?.proxy?.$Bus.on('edit', (row: any) => {
    row ? Data.editData = JSON.parse(JSON.stringify(row)) : Data.editData = {}
    Data.modalVisible = !Data.modalVisible
    Data.mainData = {}
    Object.assign(Data.mainData, Data.editData)
    fetchBranch()
  })
})
</script>

<template>
  <n-modal
    v-model:show="Data.modalVisible" class="custom-card" preset="card"
    :title="`${JSON.stringify(Data.editData) === '{}' ? '新增' : '编辑'}管理结构`" size="huge" :style="{ width: '50vw' }"
  >
    <n-form ref="formRef" label-placement="top" :model="Data.mainData" label-width="120" :rules="rules">
      <n-form-item :span="12" label="管理结构编码" path="branchCode">
        <n-input v-model:value="Data.mainData.branchCode" placeholder="请输入管理结构编码" clearable />
      </n-form-item>
      <n-form-item :span="12" label="管理结构名称" path="branchName">
        <n-input v-model:value="Data.mainData.branchName" placeholder="请输入管理结构名称" clearable />
      </n-form-item>
      <n-form-item :span="12" label="父级管理结构名称" path="parentId">
        <n-cascader
          v-model:value="Data.mainData.parentId" label-field="branchName" value-field="branchId"
          children-field="children" :options="options.parentBranchOptions" placeholder="请选择父级管理结构名称" clearable
        />
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

