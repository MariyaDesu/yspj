<script setup lang="ts">
import type { SelectOption } from 'naive-ui'
import { baseApi } from '@/api/baseApi'
import { showBtn } from '@/utils/common'
const props = defineProps<{
  buttons: string[]
}>()
const instance = getCurrentInstance()
interface searchKey {
  roleCode?: string
  roleName?: string
  roleType?: string
}
const search: searchKey = reactive({})
const editHandle = () => {
  instance?.proxy?.$Bus.emit('edit')
}
const searchHandle = () => {
  instance?.proxy?.$Bus.emit('search', search)
}
const deleteHandle = () => {
  instance?.proxy?.$Bus.emit('delete')
}
interface opt {
  roleOptions: SelectOption[]
}
const options: opt = reactive({
  roleOptions: [],
})
async function fetchRole() {
  const res = await baseApi.fetchRole({ })
  options.roleOptions = res.data.list
}
</script>

<template>
  <n-space vertical>
    <n-space>
      <n-form
        inline
        :label-width="80"
        size="small"
        :show-feedback="false"
      >
        <n-form-item label="角色编码">
          <n-input v-model:value="search.roleCode" />
        </n-form-item>

        <n-form-item label="角色名称">
          <n-input v-model:value="search.roleName" />
        </n-form-item>

        <n-form-item label="角色类型名称" path="roleType">
          <n-select
            v-model:value="search.roleType" label-field="roleName" value-field="roleId" filterable
            :options="options.roleOptions" placeholder="请选择"
            @click="fetchRole"
          />
        </n-form-item>
      </n-form>
    </n-space>
    <n-space v-if="props.buttons.length === 0 ? false : true">
      <NButton v-if="showBtn('新增', props.buttons)" type="warning" @click="editHandle">
        <template #icon>
          <icon-material-symbols-add />
        </template>
        新增
      </NButton>
      <NButton v-if="showBtn('查找', props.buttons)" type="primary" @click="searchHandle">
        查找 ( F )
      </NButton>
      <NButton v-if="showBtn('批量删除', props.buttons)" type="error" @click="deleteHandle">
        <template #icon>
          <icon-material-symbols:delete-outline />
        </template>
        批量删除
      </NButton>
    </n-space>
  </n-space>
</template>

<style scoped>

</style>

