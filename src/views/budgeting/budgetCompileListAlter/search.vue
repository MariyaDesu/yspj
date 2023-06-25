<script setup lang="ts">
import type { CascaderOption, SelectOption } from 'naive-ui'
import { NButton, NText } from 'naive-ui'
import { baseApi } from '@/api/baseApi'
import { formatDrop, renderIcon, showBtn } from '@/utils/common'
import { useBaseApiListStore } from '@/store'
import { budgetCompileListAlterApi } from '@/api/budgetApi'
const props = defineProps<{
  buttons: string[]
}>()
const baseApiListStore: any = useBaseApiListStore()
interface searchKey {
  compileCode?: string
  assetId?: number
  branchId?: number
  deptId?: number
  adjustState?: number
  budProgrammeId?: number
  // budSubjectName?: string
}
interface opt {
  assetOptions: SelectOption[]
  branchOptions: SelectOption[]
  deptOptions: CascaderOption[]
  stateOptions: SelectOption[]
  budProOptions: SelectOption[]
}
const options: opt = reactive({
  assetOptions: [],
  branchOptions: [],
  deptOptions: [],
  stateOptions: [
    {
      state: 0,
      stateName: '编制中',
    },
    {
      state: 1,
      stateName: '已保存',
    },
    {
      state: 4,
      stateName: '审批中',
    },
    {
      state: 5,
      stateName: '未通过',
    },
    {
      state: 6,
      stateName: '已完结',
    },
  ],
  budProOptions: [],

})

const search: searchKey = reactive({
})
const loading = ref(false)

const instance = getCurrentInstance()

const searchHandle = () => {
  instance?.proxy?.$Bus.emit('search', search)
}

const exportHandle = () => {
  instance?.proxy?.$Bus.emit('exportsExcel')
}

const exportHandleNo = () => {
  instance?.proxy?.$Bus.emit('exportsExcelNo')
}

const btnoptions = reactive(
  [
    {
      label: () => h(NText,
        {
          size: 'small',
          // type: 'info',
          onClick: () => exportHandle(),
        },
        { default: () => '含明细导出', icon: renderIcon('material-symbols:arrow-circle-right-outline', { size: 20 }) }),
      key: 'return',

    },
    {
      label: () => h(NText,
        {
          size: 'small',
          // type: 'error',
          onClick: () => exportHandleNo(),
        },
        { default: () => '不含明细导出', icon: renderIcon('material-symbols:arrow-circle-right-outline', { size: 20 }) }),
      key: 'returnNo',

    },

  ],
)

const submitList = () => {
  instance?.proxy?.$Bus.emit('submitList')
}
const submitProessList = () => {
  instance?.proxy?.$Bus.emit('submitProessList')
}

const editHandle = () => {
  instance?.proxy?.$Bus.emit('editHandle', { type: true })
}

async function fetchDept(val: number | undefined) {
  if (!val)
    return
  const res = await baseApi.fetchDept({ assetId: val })
  formatDrop(res.data)
  options.deptOptions = res.data
}
// 获取预算方案
async function getselectCurrent() {
  try {
    const res = await budgetCompileListAlterApi.getselectCurrent()
    if (res.code === 200)
      options.budProOptions = res.data
  }
  catch (error) {
    console.error(error)
    options.budProOptions = []
  }
}

onMounted(() => {
  options.assetOptions = baseApiListStore.assetUserInfo
  options.branchOptions = baseApiListStore.branchUserInfo
  getselectCurrent()
})
</script>

<template>
  <n-space vertical>
    <n-form
      ref="formRef" label-placement="top" :model="search" label-width="100"
      size="small"
      :show-feedback="false"
      inline
    >
      <n-grid :cols="24" :x-gap="24">
        <n-form-item-gi span="4" label="预算编制编码">
          <n-input v-model:value="search.compileCode" />
        </n-form-item-gi>

        <n-form-item-gi label="产权结构" span="4" path="assetId">
          <NSelect
            v-model:value="search.assetId" label-field="assetName" value-field="assetId" filterable
            :options="options.assetOptions" placeholder="请选择" clearable
            @update:value="fetchDept(search.assetId)"
          />
        </n-form-item-gi>
        <n-form-item-gi label="管理结构" span="4" path="branchId">
          <NSelect
            v-model:value="search.branchId" clearable filterable :options="options.branchOptions"
            label-field="branchName" value-field="branchId" placeholder="请选择"
          />
        </n-form-item-gi>
        <n-form-item-gi label="部门" span="4" path="deptId">
          <NCascader
            v-model:value="search.deptId" label-field="deptName" value-field="deptId" filterable
            :options="options.deptOptions" placeholder="请选择" clearable :disabled="!search.assetId"
          />
        </n-form-item-gi>
        <n-form-item-gi label="状态" span="4" path="adjustState">
          <NSelect
            v-model:value="search.adjustState" clearable filterable :options="options.stateOptions"
            label-field="stateName" value-field="state" placeholder="请选择"
          />
        </n-form-item-gi>
        <n-form-item-gi label="预算方案" path="budProgrammeId" span="4">
          <NSelect
            v-model:value="search.budProgrammeId" label-field="name" value-field="id" filterable
            :options="options.budProOptions" placeholder="请选择" clearable
          />
        </n-form-item-gi>
      </n-grid>
    </n-form>
    <n-space v-if="props.buttons.length === 0 ? false : true">
      <NDropdown v-if="showBtn('导出', props.buttons)" trigger="click" :loading="loading" :options="btnoptions">
        <NButton type="info">
          <template #icon>
            <icon-uil:file-import />
          </template>
          导出
        </NButton>
      </NDropdown>
      <NButton v-if="showBtn('查找', props.buttons)" type="primary" @click="searchHandle">
        查找 ( F )
      </NButton>
      <NButton v-if="showBtn('新增', props.buttons) && baseApiListStore.timeInfo.canUpdate === 1" type="warning" @click="editHandle">
        <template #icon>
          <icon-material-symbols-add />
        </template>
        新增
      </NButton>
      <NButton v-if="showBtn('批量保存', props.buttons) && baseApiListStore.timeInfo.canUpdate === 1" type="warning" @click="submitList">
        <template #icon>
          <icon-material-symbols-add />
        </template>
        批量保存
      </NButton>
      <NButton v-if="showBtn('批量提交', props.buttons) && baseApiListStore.timeInfo.canUpdate === 1" type="warning" @click="submitProessList">
        <template #icon>
          <icon-material-symbols-add />
        </template>
        批量提交
      </NButton>
    </n-space>
  </n-space>
</template>

<style scoped>

</style>

