<script setup lang="ts">
import { sysRoleApi } from '@/api/sysManaApi'
interface dataType {
  roleId: string
  showTransfer: boolean
  options: Array<any>
  value: Array<any>
}
const Data: dataType = reactive({
  roleId: '',
  showTransfer: false,
  options: [],
  value: [],
})
const instance = getCurrentInstance()
function fetchTableData() {
  instance?.proxy?.$Bus.emit('fetchData')
}
instance?.proxy?.$Bus.on('trasferMenu', (row: any) => {
  Data.showTransfer = !Data.showTransfer
  Data.value = []
  Data.roleId = row.roleId
  getUserRoleList(Data.roleId)
})
async function editMsg(type: number) {
  if (type === 1) {
    const res = await sysRoleApi.addRoleMenu(
      { roleId: Data.roleId, menus: Data.value },
    )
    if (res.code === 200) {
      window.$notification?.success({ title: '保存成功！', duration: 2500 })
      Data.showTransfer = false
    }
    else { window.$notification?.warning({ title: `${res.message}`, duration: 2500 }) }
    fetchTableData()
  }
  else if (type === 0) {
    Data.showTransfer = false
  }
}
async function getUserRoleList(val: string) {
  Data.options = []
  const res = await sysRoleApi.getRoleMenuList({ roleId: val })
  if (res.code === 200) {
    res.data.myMenu?.forEach((item: any) => {
      Data.value.push(item.menuId)
      Data.options.push({
        label: item.title,
        value: item.menuId,
      })
    })
    res.data.myNotMenu?.forEach((item: any) => {
      Data.options.push({
        label: item.title,
        value: item.menuId,
      })
    })
  }
}
</script>

<template>
  <n-modal
    v-model:show="Data.showTransfer" class="custom-card" preset="card" title="分配权限" size="huge"
    :style="{ height: '80vh', width: '100vh' }"
  >
    <n-legacy-transfer ref="transfer" v-model:value="Data.value" source-title="剩余权限" target-title="当前权限" :options="Data.options" wh-full source-filterable />
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
