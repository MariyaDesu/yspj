<script setup lang="ts">
import type { CascaderOption, FormInst, SelectOption } from 'naive-ui'
import { rules } from './common'
import { sysEquityApi } from '@/api/sysManaApi'
import { baseApi } from '@/api/baseApi'
interface list {
  assetId?: string
  abbreviation?: string
  branchId?: string
  parentId?: string | number
  assetType?: string
  organType?: string
  branchName?: string
  assetCode?: string
  assetName?: string
  createdUser?: string
  createdDate?: string
  modifiedUser?: string
  modifiedDate?: string
  legalRepresentative?: string
  taxNo?: string
}
interface dataList {
  modalVisible: boolean
  editData: object
  mainData: list
}
const Data = reactive<dataList>({
  modalVisible: false,
  editData: {},
  mainData: {},
})

interface opt {
  deptStateOptions: CascaderOption[]
  assetTypeOptions: SelectOption[]
  assetOptions: CascaderOption[]
  organTypeOptions: SelectOption[]
}
const options: opt = reactive({
  deptStateOptions: [],
  assetTypeOptions: [],
  assetOptions: [],
  organTypeOptions: [],
})
async function fetchDeptState() {
  const res = await baseApi.fetchBranch({})
  options.deptStateOptions = res.data
}

async function fetchAssetType() {
  const res = await baseApi.fetchAssetType({ keyWord: 'CQLX' })
  options.assetTypeOptions = res.data
}
// async function fetchOrganizationType() {
//   const res = await baseApi.fetchOrganizationType({ keyWord: 'CQJGLX' })
//   options.organTypeOptions = res.data
// }
async function fetchAssetOptionsList() {
  const res = await baseApi.getAssetList({})
  options.assetOptions = res.data
}

const instance = getCurrentInstance()
function fetchTableData() {
  instance?.proxy?.$Bus.emit('fetchData')
}
const formRef = ref<FormInst | null>(null)

async function editMsg(type: number) {
  if (type === 1) {
    formRef.value?.validate(async (errors) => {
      if (!errors) {
        if (Data.mainData.parentId === '')
          Data.mainData.parentId = 0
        const res = JSON.stringify(Data.editData) === '{}'
          ? await sysEquityApi.saveAddEquity(
            Data.mainData,
          )
          : await sysEquityApi.saveEditEquity(
            Data.mainData,
          )
        if (res.code === 200) {
          window.$notification?.success({ title: '保存成功！', duration: 2500 })
          Data.modalVisible = false
        }
        else { window.$notification?.warning({ title: `${res.message}`, duration: 2500 }) }

        fetchTableData()
      }
      else {
        window.$message?.error('请填写必填项')
      }
    })
  }
  else if (type === 0) {
    Data.modalVisible = false
  }
}

onMounted(() => {
  instance?.proxy?.$Bus.on('edit', (row: any) => {
    row ? Data.editData = JSON.parse(JSON.stringify(row)) : Data.editData = {}

    Data.modalVisible = !Data.modalVisible
    Data.mainData = {}
    Object.assign(Data.mainData, Data.editData)
    if (Data.mainData.parentId === 0)
      Data.mainData.parentId = ''
    fetchDeptState()
    fetchAssetType()
    fetchAssetOptionsList()
    // fetchOrganizationType()
  })
})

// watch(() => Data.modalVisible, (newVal) => {
//   if (newVal === true && Data.mainData.branchId !== undefined)
//     handleUpdateValue(Data.mainData.branchId)
// })
</script>

<template>
  <n-modal
    v-model:show="Data.modalVisible" class="custom-card" preset="card"
    :title="`${JSON.stringify(Data.editData) === '{}' ? '新增' : '编辑'}产权资料`" size="huge"
    :style="{ width: '50vw' }"
  >
    <n-form ref="formRef" label-placement="top" :model="Data.mainData" label-width="120" :rules="rules">
      <n-form-item label="产权结构编码" path="assetCode">
        <n-input v-model:value="Data.mainData.assetCode" clearable placeholder="请输入" />
      </n-form-item>
      <n-form-item label="产权结构名称" path="assetName">
        <n-input v-model:value="Data.mainData.assetName" clearable placeholder="请输入" />
      </n-form-item>
      <n-form-item label="产权结构简称" path="abbreviation">
        <n-input v-model:value="Data.mainData.abbreviation" clearable placeholder="请输入" />
      </n-form-item>
      <n-form-item label="管理结构" path="branchId">
        <n-cascader
          v-model:value="Data.mainData.branchId" filterable :options="options.deptStateOptions"
          label-field="branchName" value-field="branchId" placeholder="请选择" clearable
        />
      </n-form-item>
      <n-form-item label="父级产权结构" path="parentId">
        <n-cascader
          v-model:value="Data.mainData.parentId" label-field="assetName" value-field="assetId" filterable
          :options="options.assetOptions" placeholder="请选择" clearable
          children-field="children"
        />
      </n-form-item>
      <!-- <n-form-item label="产权机构类型" path="organType">
        <n-select
          v-model:value="Data.mainData.organType" filterable :options="options.organTypeOptions"
          label-field="dictValue" value-field="keyValue"
          clearable placeholder="请选择"
        />
      </n-form-item> -->
      <n-form-item label="产权类型" path="assetType">
        <n-select
          v-model:value="Data.mainData.assetType" filterable :options="options.assetTypeOptions"
          label-field="dictValue" value-field="keyValue"
          clearable placeholder="请选择"
        />
      </n-form-item>

      <n-form-item label="法人代表" path="legalRepresentative">
        <n-input v-model:value="Data.mainData.legalRepresentative" placeholder="请输入法人代表" />
      </n-form-item>

      <n-form-item :span="8" label="纳税号" path="taxNo">
        <n-input v-model:value="Data.mainData.taxNo" placeholder="请输入纳税号" />
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

<style scoped>

</style>
