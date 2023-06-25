<script setup lang="ts">
import { sysMenuApi } from '@/api/sysManaApi'

interface mainDataObj {
  menuId?: string
  buttonText?: string
  buttonName?: string
  buttonType?: number
  iconClass?: string
  sort?: number
  enabled?: string
}

interface data {
  modalVisible?: boolean
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
    Data.mainData.buttonType = 0
    const res = JSON.stringify(Data.editData) === '{}'
      ? await sysMenuApi.saveAddBtn(
        Data.mainData,
      )
      : await sysMenuApi.saveEditBtn(
        Data.mainData,
      )
    if (res.code === 200) {
      window.$notification?.success({ title: '保存成功！', duration: 2500 })
      fetchTableData()
      Data.modalVisible = false
    }
    else {
      window.$notification?.error({ title: res.message, duration: 2500 })
    }
  }
  else if (type === 0) { Data.modalVisible = false }
}
function fetchTableData() {
  instance?.proxy?.$Bus.emit('treeList')
}

onMounted(() => {
  instance?.proxy?.$Bus.on('btnEdit', (row: any) => {
    // 新增
    if (row.type) {
      Data.mainData = {}
      Data.editData = {}
      Data.mainData.menuId = row.menuId
    }
    // 编辑
    else {
      Data.editData = row.row
      Data.mainData = {}
      Object.assign(Data.mainData, Data.editData)
    }
    Data.modalVisible = !Data.modalVisible
  })
})
</script>

<template>
  <n-modal
    v-model:show="Data.modalVisible" class="custom-card" preset="card"
    :title="`${JSON.stringify(Data.editData) === '{}' ? '新增' : '编辑'}按钮`" size="huge"
    :style="{ width: '50vw' }"
  >
    <n-form ref="formRef" label-placement="top" :model="Data.mainData" label-width="120">
      <n-form-item label="按钮文本">
        <n-input v-model:value="Data.mainData.buttonText" clearable placeholder="请输入" />
      </n-form-item>
      <n-form-item label="按钮名称">
        <n-input v-model:value="Data.mainData.buttonName" clearable placeholder="请输入" />
      </n-form-item>
      <n-form-item label="按钮样式">
        <n-input v-model:value="Data.mainData.iconClass" clearable placeholder="请输入" />
      </n-form-item>
      <n-form-item label="排序">
        <n-input-number v-model:value="Data.mainData.sort" clearable wh-full placeholder="请输入" :show-button="false" />
      </n-form-item>
      <n-form-item label="是否启用" path="string">
        否
        <n-switch v-model:value="Data.mainData.enabled" ml-5 mr-5 :checked-value="1" :unchecked-value="0" />
        是
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
