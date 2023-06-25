<script setup lang="ts">
import type { SelectOption } from 'naive-ui'
import { sysMenuApi } from '@/api/sysManaApi'
import { baseApi } from '~/src/api/baseApi'
interface mainDataObj {
  menuId?: number
  menuName?: string
  component?: string
  title?: string
  parentId?: number | null
  menuType?: number
  menuTypeName?: string
  url?: string
  lconClass?: string
  lconUrl?: string
  sort?: number
  enabled?: number
  remark?: string
  list?: Array<any>
}

interface data {
  modalVisible?: boolean
  keyValue?: number
  editData?: object
  mainData: mainDataObj
  flag?: boolean
}
const Data: data = reactive({
  modalVisible: false,
  editData: {},
  mainData: {},
  flag: false,
})
const instance = getCurrentInstance()
const editMsg = async (type: number) => {
  if (type === 1) {
    const res = JSON.stringify(Data.editData) === '{}'
      ? await sysMenuApi.saveAddMenu(
        Data.mainData,
      )
      : await sysMenuApi.saveEditMenu(
        Data.mainData,
      )
    if (res.code === 200) {
      window.$notification?.success({ title: '保存成功！', duration: 2500 })
      Data.modalVisible = false
    }
    else {
      window.$notification?.error({ title: res.message, duration: 2500 })
    }
  }
  else if (type === 0) { Data.modalVisible = false }
  fetchTableData()
}
function fetchTableData() {
  instance?.proxy?.$Bus.emit('treeList')
}

interface opt<T> {
  menuOptions: T
  menuTypeOptions: T
}
const options: opt<SelectOption[]> = reactive ({
  menuOptions: [],
  menuTypeOptions: [],
})
// const menuOptions: SelectOption[] = reactive([])
// const menuTypeOptions: SelectOption[] = reactive([])
async function fetchMenu() {
  const res = await baseApi.fetchMenu({})
  if (res.code === 200)
    options.menuOptions = res.data
}
async function fetchMenuType() {
  const res = await baseApi.fetchMenuType({ keyWord: 'CDLX' })
  if (res.code === 200)
    options.menuTypeOptions = res.data
}
function handleUpdateValue() {
  if (Data.mainData.menuType === 2) {
    Data.flag = true
    Data.mainData.parentId = 0
    options.menuOptions = [{
      menuId: 0,
      title: '无',
    }]
  }

  else {
    Data.flag = false
    Data.mainData.parentId = null
    fetchMenu()
  }
}

onMounted(() => {
  instance?.proxy?.$Bus.on('changeSysMenuEdit', (row: any) => {
    // 新增
    if (row.type) {
      Data.mainData = {}
      Data.editData = {}
      Data.keyValue = row.keyVal.menuId
    }
    // 编辑
    else {
      Data.editData = row.keyVal
      Data.mainData = {}
      Object.assign(Data.mainData, Data.editData)
    }

    Data.modalVisible = !Data.modalVisible
    fetchMenu()
    fetchMenuType()
  })

  // handleUpdateValue()
})
</script>

<template>
  <n-modal
    v-model:show="Data.modalVisible" class="custom-card" preset="card"
    :title="`${JSON.stringify(Data.editData) === '{}' ? '新增' : '编辑'}菜单`" size="huge"
    :style="{ width: '50vw' }"
  >
    <n-form ref="formRef" label-placement="top" :model="Data.mainData" label-width="120">
      <n-form-item label="菜单名称">
        <n-input v-model:value="Data.mainData.menuName" clearable placeholder="请输入" />
      </n-form-item>
      <n-form-item label="菜单组件">
        <n-input v-model:value="Data.mainData.component" clearable placeholder="请输入" />
      </n-form-item>
      <n-form-item label="菜单标题">
        <n-input v-model:value="Data.mainData.title" clearable placeholder="请输入" />
      </n-form-item>
      <n-form-item label="菜单类型" path="menuType">
        <n-select
          v-model:value="Data.mainData.menuType" label-field="dictValue" value-field="keyValue" filterable
          :options="options.menuTypeOptions" placeholder="请选择菜单类型名称"
          @update:value="handleUpdateValue"
        />
      </n-form-item>
      <n-form-item label="上级目录" path="parentId">
        <n-select
          v-model:value="Data.mainData.parentId" label-field="title" value-field="menuId" filterable
          :options="options.menuOptions" placeholder="请选择菜单类型名称"
          :disabled="Data.flag"
        />
      </n-form-item>
      <n-form-item label="菜单导航URL">
        <n-input v-model:value="Data.mainData.url" clearable placeholder="请输入" />
      </n-form-item>
      <n-form-item label="图标class">
        <n-input v-model:value="Data.mainData.lconClass" clearable placeholder="请输入" />
      </n-form-item>
      <n-form-item label="图标Url">
        <n-input v-model:value="Data.mainData.lconUrl" clearable placeholder="请输入" />
      </n-form-item>
      <n-form-item label="排序">
        <n-input-number v-model:value="Data.mainData.sort" clearable wh-full placeholder="请输入" :show-button="false" />
      </n-form-item>
      <n-form-item label="是否启用" path="string">
        否
        <n-switch v-model:value="Data.mainData.enabled" ml-5 mr-5 :checked-value="1" :unchecked-value="0" />
        是
      </n-form-item>
      <n-form-item label="备注">
        <n-input v-model:value="Data.mainData.remark" clearable placeholder="请输入" />
      </n-form-item>
      <!-- <n-form-item label="子集">
        <n-input v-model:value="Data.mainData.list" clearable placeholder="请输入" />
      </n-form-item> -->
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
