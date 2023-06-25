<script setup lang="ts">
import type { CascaderOption, FormInst } from 'naive-ui'
import { rules } from './common'
import { formatDrop } from '@/utils/common'
import { deptManagementApi } from '@/api/basisSetApi'
import { baseApi } from '@/api/baseApi'
interface list {
  deptName?: string
  deptCode?: string
  branchId?: string
  supDept?: number | null
  assetId?: number
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
  deptOptions: CascaderOption[]
  assetOptions: CascaderOption[]
}
const options: opt = reactive ({
  deptStateOptions: [],
  deptOptions: [],
  assetOptions: [],
})

const instance = getCurrentInstance()
// 重新获取表格数据
function fetchTableData() {
  instance?.proxy?.$Bus.emit('fetchData')
}

const formRef = ref<FormInst | null>(null)
async function editMsg(type: number) {
  if (type === 1) {
    formRef.value?.validate(async (errors) => {
      if (!errors) {
        if (Data.mainData.supDept === null)
          Data.mainData.supDept = 0
        const res = JSON.stringify(Data.editData) === '{}'
          ? await deptManagementApi.saveAddDept(
            Data.mainData,
          )
          : await deptManagementApi.saveEditDept(
            Data.mainData,
          )

        if (res.code === 200) {
          window.$notification?.success({ title: '保存成功！', duration: 2500 })
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

  else if (type === 0) {
    Data.modalVisible = false
  }
}
// 获取产权
async function fetchAssetOptionsList() {
  const res = await baseApi.getAssetList({})
  formatDrop(res.data)
  options.assetOptions = res.data
}
// 获取部门
async function fetchDept(val: number | undefined) {
  const res = await baseApi.fetchDept({ assetId: val })
  formatDrop(res.data)
  options.deptOptions = res.data
}

onMounted(() => {
  instance?.proxy?.$Bus.on('edit', (row: any) => {
    row ? Data.editData = JSON.parse(JSON.stringify(row)) : Data.editData = {}
    Data.modalVisible = !Data.modalVisible
    Data.mainData = {}
    Object.assign(Data.mainData, Data.editData)
    if (Data.mainData.supDept === 0)
      Data.mainData.supDept = null
    if (Data.mainData.assetId)
      fetchDept(Data.mainData.assetId)
    fetchAssetOptionsList()
  })
})
</script>

<template>
  <n-modal
    v-model:show="Data.modalVisible" class="custom-card" preset="card"
    :title="`${JSON.stringify(Data.editData) === '{}' ? '新增' : '编辑'}部门资料`" size="huge"
    :style="{ width: '50vw' }"
  >
    <n-form ref="formRef" label-placement="top" :model="Data.mainData" label-width="120" :rules="rules">
      <n-form-item label="部门编码" path="deptCode">
        <n-input v-model:value="Data.mainData.deptCode" clearable placeholder="请输入" />
      </n-form-item>
      <n-form-item label="部门名称" path="deptName">
        <n-input v-model:value="Data.mainData.deptName" clearable placeholder="请输入" />
      </n-form-item>
      <n-form-item label="产权结构" path="assetId">
        <NCascader
          v-model:value="Data.mainData.assetId" label-field="assetName" value-field="assetId" filterable
          :options="options.assetOptions" placeholder="请选择" clearable
          children-field="children"
        />
      </n-form-item>
      <n-form-item label="上级部门" span="6" path="deptId">
        <NCascader
          v-model:value="Data.mainData.supDept" label-field="deptName" value-field="deptId" filterable
          :options="options.deptOptions" placeholder="请选择" clearable
          :disabled="!Data.mainData.assetId"
          @click="fetchDept(Data.mainData.assetId)"
        />
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
