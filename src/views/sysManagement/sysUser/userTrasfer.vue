<script setup lang="ts">
import { sysUserApi } from '@/api/sysManaApi'
interface dataType {
  userId: string
  showTransfer: boolean
  options: Array<any>
  value: Array<any>
}
const Data: dataType = reactive({
  userId: '',
  showTransfer: false,
  options: [],
  value: [],
})
const instance = getCurrentInstance()

async function editMsg(type: number) {
  if (type === 1) {
    const res = await sysUserApi.addUserRole(
      { userId: Data.userId, roles: Data.value },
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
function fetchTableData() {
  instance?.proxy?.$Bus.emit('fetchData')
}

async function getUserRoleList(val: string) {
  Data.options = []
  const res = await sysUserApi.getUserRoleList({ userId: val })
  if (res.code === 200) {
    res.data.myRole?.forEach((item: any) => {
      Data.value.push(item.roleId)
      Data.options.push({
        label: item.roleName,
        value: item.roleId,
      })
    })
    res.data.myNotRole?.forEach((item: any) => {
      Data.options.push({
        label: item.roleName,
        value: item.roleId,
      })
    })
  }
}
onMounted(() => {
  instance?.proxy?.$Bus.on('trasfer', (row: any) => {
    Data.showTransfer = !Data.showTransfer
    Data.value = []
    Data.userId = row.userId
    getUserRoleList(Data.userId)
  })
})
</script>

<template>
  <n-modal
    v-model:show="Data.showTransfer" class="custom-card" preset="card" title="分配角色" size="huge"
    :style="{ height: '80vh', width: '100vh' }"
  >
    <n-legacy-transfer ref="transfer" v-model:value="Data.value" source-title="剩余角色" target-title="当前角色" :options="Data.options" wh-full source-filterable />
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
