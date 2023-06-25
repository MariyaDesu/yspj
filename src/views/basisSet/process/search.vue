<script setup lang="ts">
import type { CascaderOption, SelectOption } from 'naive-ui'
import { baseApi } from '@/api/baseApi'
import { showBtn } from '@/utils/common'

const props = defineProps<{
  buttons: string[]
}>()

interface searchKey {
  processCode?: string
  processName?: string
  billTypeId?: string
  deptId?: string
  subjectId?: string
  branchId?: string
  assetId?: string
}

const search: searchKey = reactive({
})
interface opt {
  billTypeOptions: SelectOption[]
  deptOptions: CascaderOption[]
  deptStateOptions: CascaderOption[]
  assetOptions: SelectOption[]
  branchOptions: CascaderOption[]
}
const options: opt = reactive({
  billTypeOptions: [],
  deptOptions: [],
  deptStateOptions: [],
  assetOptions: [],
  branchOptions: [],
})

const instance = getCurrentInstance()
const editHandle = () => {
  instance?.proxy?.$Bus.emit('edit')
}
async function getBillTypeList() {
  options.billTypeOptions = []
  const res = await baseApi.getBillTypeList({})
  options.billTypeOptions = res.data.list
}

async function fetchBranchType() {
  const res = await baseApi.getBudgetEntryMenuList({})
  options.deptStateOptions = res.data
}

instance?.proxy?.$Bus.off('search')
const searchHandle = () => {
  instance?.proxy?.$Bus.emit('search', search)
}

async function fetchAssetOptionsList() {
  const res = await baseApi.getAssetList({})
  options.assetOptions = res.data.list
}

onMounted(() => {
  getBillTypeList()
  fetchBranchType()
  // fetchBranch()
  fetchAssetOptionsList()
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
        <n-form-item label="编码">
          <n-input v-model:value="search.processCode" />
        </n-form-item>
        <n-form-item label="流程名称">
          <n-input v-model:value="search.processName" />
        </n-form-item>
        <n-form-item label="单据类型">
          <n-select
            v-model:value="search.billTypeId" label-field="billTypeName" value-field="billTypeId" filterable
            :options="options.billTypeOptions" placeholder="请选择"
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
    </n-space>
  </n-space>
</template>

<style scoped>

</style>

