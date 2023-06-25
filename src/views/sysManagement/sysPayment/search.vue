<script setup lang="ts">
import type { SelectOption } from 'naive-ui'
import { formatSelectDrop } from '@/utils/common/dropDown'
import { baseApi } from '@/api/baseApi'
import { showBtn } from '@/utils/common'
const props = defineProps<{
  buttons: string[]
}>()
interface searchKey {
  assetId?: string
  branchId?: string
  bankAccountNumber?: string
  bankName?: string
}

const search: searchKey = reactive({})

const instance = getCurrentInstance()
const editHandle = () => {
  instance?.proxy?.$Bus.emit('edit')
}

const searchHandle = () => {
  instance?.proxy?.$Bus.emit('search', search)
}

const deleteHandle = () => {
  instance?.proxy?.$Bus.emit('delete')
}

interface IOption {
  assetOptions: SelectOption[]
  deptStateOptions: SelectOption[]
}

const options: IOption = reactive({
  assetOptions: [],
  deptStateOptions: [],
})
async function fetchAssetOptionsList() {
  const res = await baseApi.getAssetAllList({})
  options.assetOptions = res.data
  formatSelectDrop(options.assetOptions)
}

async function fetchDeptState() {
  const res = await baseApi.getBranchAllList({})
  options.deptStateOptions = res.data
  formatSelectDrop(options.deptStateOptions)
}

const loading = ref(false)

onMounted(() => {
  instance?.proxy?.$Bus.on('loading', (val: boolean) => {
    loading.value = val
  })
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
        <n-form-item label="产权结构名称" span="8" path="assetId">
          <NSelect
            v-model:value="search.assetId" label-field="assetName" value-field="assetId" filterable
            :options="options.assetOptions" placeholder="请选择" clearable children-field="children"
            @click="fetchAssetOptionsList"
          />
        </n-form-item>
        <n-form-item label="管理结构名称" path="branchId">
          <NSelect
            v-model:value="search.branchId" filterable :options="options.deptStateOptions"
            label-field="branchName" value-field="branchId" placeholder="请选择" clearable @click="fetchDeptState"
          />
        </n-form-item>
        <n-form-item label="银行名称" path="bankName">
          <n-input v-model:value="search.bankName" clearable placeholder="请输入" />
        </n-form-item>
        <n-form-item label="银行账号" path="bankAccountNumber">
          <n-input v-model:value="search.bankAccountNumber" clearable placeholder="请输入" />
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

