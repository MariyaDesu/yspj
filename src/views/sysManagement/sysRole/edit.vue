<script setup lang="ts">
import type { FormInst, SelectOption } from 'naive-ui'
import { rules } from './common'
import { sysRoleApi } from '@/api/sysManaApi'
import { baseApi } from '@/api/baseApi'
interface IMainData {
  roleCode?: string
  roleName?: string
  roleType?: string
  enabled?: string
  sort?: number
  memo?: string
}
interface IDataList {
  modalVisible: boolean
  editData: IMainData
  mainData: IMainData
}
const Data: IDataList = reactive({
  modalVisible: false,
  editData: {},
  mainData: {
  },
})

const instance = getCurrentInstance()
function fetchTableData() {
  instance?.proxy?.$Bus.emit('fetchData')
}
const formRef = ref<FormInst | null>(null)
async function editMsg() {
  formRef.value?.validate(async (errors) => {
    if (!errors) {
      const res = JSON.stringify(Data.editData) === '{}'
        ? await sysRoleApi.saveAddRole(
          Data.mainData,
        )
        : await sysRoleApi.saveEditRole(
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

const roleOptions: SelectOption[] = reactive([])
// 获取角色下拉
async function fetchRole() {
  const res = await baseApi.fetchRole({})
  res.data.list.forEach((item: any) => {
    roleOptions.push(item)
  })
}

onMounted(() => {
  instance?.proxy?.$Bus.on('edit', (row: any) => {
    row ? Data.editData = JSON.parse(JSON.stringify(row)) : Data.editData = {}
    Data.modalVisible = !Data.modalVisible
    Data.mainData = {}
    Object.assign(Data.mainData, Data.editData)
    fetchRole()
  })
})
</script>

<template>
  <n-modal
    v-model:show="Data.modalVisible" class="custom-card" preset="card"
    :title="`${JSON.stringify(Data.editData) === '{}' ? '新增' : '编辑'}角色资料`" size="huge"
    :style="{ width: '50vw' }"
  >
    <n-form
      ref="formRef" label-placement="top" :model="Data.mainData" label-width="120" :rules="rules"
      require-mark-placement="left"
    >
      <n-form-item label="角色编码" path="roleCode">
        <n-input v-model:value="Data.mainData.roleCode" clearable placeholder="请输入" />
      </n-form-item>
      <n-form-item label="角色名称" path="roleName">
        <n-input v-model:value="Data.mainData.roleName" clearable placeholder="请输入" />
      </n-form-item>
      <n-form-item label="是否启用" path="sex">
        禁用
        <n-switch v-model:value="Data.mainData.enabled" ml-5 mr-5 :checked-value="1" :unchecked-value="0" />
        启用
      </n-form-item>
      <n-form-item label="排序" path="sort">
        <n-input-number v-model:value="Data.mainData.sort" clearable placeholder="请输入" wh-full :show-button="false" />
      </n-form-item>
      <n-form-item label="备注" path="memo">
        <n-input v-model:value="Data.mainData.memo" clearable placeholder="请输入" />
      </n-form-item>
    </n-form>
    <template #footer>
      <NLayout text-center>
        <NButton type="info" mr-10 @click="editMsg()">
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
