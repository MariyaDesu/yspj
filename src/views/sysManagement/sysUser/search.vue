<script setup lang="ts">
import type { CascaderOption, SelectOption } from 'naive-ui'
import { baseApi } from '@/api/baseApi'
import { showBtn } from '@/utils/common'
const props = defineProps<{
  buttons: string[]
}>()
interface searchKey {
  keyWord?: string
  linkmanMobile?: string
  branchId?: string
  deptId?: string | null
  dutyId?: string
}

const search: searchKey = reactive({
})
const flag = ref(true)
const instance = getCurrentInstance()
const editHandle = () => {
  instance?.proxy?.$Bus.emit('edit')
}

const searchHandle = () => {
  instance?.proxy?.$Bus.emit('search', search)
}

interface opt {
  branchOptions: CascaderOption[]
  deptOptions: CascaderOption[]
  dutyOptions: SelectOption[]
}
const options: opt = reactive({
  branchOptions: [],
  deptOptions: [],
  dutyOptions: [],
})
async function fetchBranch() {
  options.branchOptions = []
  const res = await baseApi.fetchBranch({})
  res.data.forEach((item: any) => {
    options.branchOptions.push(item)
  })
}

async function fetchDept(key: any) {
  options.deptOptions = []
  const res = await baseApi.fetchDept({ branchId: key })
  res.data.forEach((item: any) => {
    options.deptOptions.push(item)
  })
}

async function fetchDuty() {
  options.dutyOptions = []
  const res = await baseApi.fetchDutyList({})
  options.dutyOptions = res.data
}

function handleUpdateValue() {
  fetchDept(search.branchId)
  search.deptId = null
  flag.value = false
}

const loading = ref(false)
const exportHandle = () => {
  instance?.proxy?.$Bus.emit('exportsExcel')
}
const deleteHandle = () => {
  instance?.proxy?.$Bus.emit('delete')
}
onMounted(() => {
  instance?.proxy?.$Bus.on('loading', (val: boolean) => {
    loading.value = val
  })
  fetchBranch()
  fetchDuty()
})
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
        <n-form-item label="用户名称/联系人姓名">
          <n-input v-model:value="search.keyWord" />
        </n-form-item>
        <n-form-item label="电话号码">
          <n-input v-model:value="search.linkmanMobile" />
        </n-form-item>
        <n-form-item label="管理结构" path="branchId">
          <n-cascader
            v-model:value="search.branchId"
            w-300 filterable :options="options.branchOptions" label-field="branchName"
            value-field="branchId" placeholder="请选择"
            :show-path="false"
            @update:value="handleUpdateValue"
          />
        </n-form-item>
        <n-form-item label="部门" path="deptId">
          <n-cascader
            v-model:value="search.deptId"
            w-200
            label-field="deptName" value-field="deptId"
            children-field="children"
            :options="options.deptOptions"
          />
        </n-form-item>
        <n-form-item label="职位" path="dutyId">
          <n-select
            v-model:value="search.dutyId"
            w-200
            label-field="dutyName" value-field="dutyId"
            children-field="children"
            :options="options.dutyOptions"
          />
        </n-form-item>
      </n-form>
    </n-space>
    <n-space v-if="props.buttons.length === 0 ? false : true">
      <NButton v-if="showBtn('导出', props.buttons)" type="info" :loading="loading" @click="exportHandle">
        <template #icon>
          <icon-uil:file-import />
        </template>
        导出
      </NButton>
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

