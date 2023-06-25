<script setup lang="ts">
import type { CascaderOption, SelectOption } from 'naive-ui'
import { formatDrop, formatSelectDrop, showBtn } from '@/utils/common'
import { useBaseApiListStore } from '@/store'
import { baseApi } from '@/api/baseApi'
const router = useRouter()
const baseApiListStore = useBaseApiListStore()
const { currentRoute } = router
interface CurrentRouteMetaList {
  currentRouteMeta: any
}
const currentRouteMetaList: CurrentRouteMetaList = reactive({
  currentRouteMeta: currentRoute.value.meta,
})
interface ISearch {
  assetId?: number
  branchId?: number
  deptId?: number
  feeType?: number
  compileName?: string
  subjectType?: number
  budSubjectId?: number
  beginTimeYear?: string
  endTimeYear?: string
  beginTimeMounth?: string
  endTimeMounth?: string
  level?: number
  ifHeTong?: number
}

const search: ISearch = reactive({
  // ifHeTong: 4,
})

const instance = getCurrentInstance()

const searchHandle = () => {
  instance?.proxy?.$Bus.emit('search', search)
}
const changeHandle = () => {
  instance?.proxy?.$Bus.emit('change')
}
const timeMonthstamp = ref<[number, number]>()
interface IOption {
  assetOptions: SelectOption[]
  branchOptions: SelectOption[]
  deptOptions: CascaderOption[]
  feeTypeOptions: SelectOption[]
  budSubjectTypeOptions: SelectOption[]
  budSubOptions: CascaderOption[]
  levelOptions: SelectOption[]
  ifHeTongOption: SelectOption[]
}

const options: IOption = reactive({
  assetOptions: [],
  branchOptions: [],
  deptOptions: [],
  feeTypeOptions: [
    {
      feeType: 1,
      feeTypeName: '收入类',
    },
    {
      feeType: 2,
      feeTypeName: '支出类',
    },
  ],
  budSubjectTypeOptions: [
    {
      budSubjectTypeId: 1,
      budSubjectTypeName: '预算科目',
    },
    {
      budSubjectTypeId: 2,
      budSubjectTypeName: '会计科目',
    },
  ],

  budSubOptions: [],
  levelOptions: [
    {
      level: 1,
      levelName: '1级',
    },
    {
      level: 2,
      levelName: '2级',
    },
    {
      level: 3,
      levelName: '3级',
    },
  ],

  ifHeTongOption: [
    {
      ifHeTong: 0,
      ifHeTongName: '有合同',
    },
    {
      ifHeTong: 1,
      ifHeTongName: '无合同',
    },
    {
      ifHeTong: 2,
      ifHeTongName: '/',
    },
    {
      ifHeTong: 3,
      ifHeTongName: '所有',
    },
  ],
})

async function fetchBranch() {
  const res = await baseApi.getUserBranchSelect({})
  if (res.code === 200) {
    formatSelectDrop(res.data)
    options.branchOptions = res.data
  }
}

async function fetchAssetOptionsList() {
  const res = await baseApi.getUserAssetSelect({})
  formatSelectDrop(res.data)
  options.assetOptions = res.data
}

async function fetchDept(val: number | undefined) {
  if (!val)
    return
  const res = await baseApi.fetchDept({ assetId: val })
  formatDrop(res.data)
  options.deptOptions = res.data
}

function formatMonthTime() {
  if (!timeMonthstamp.value)
    return
  search.beginTimeYear = `${new Date(timeMonthstamp.value![0]).getFullYear()}`
  search.endTimeYear = `${new Date(timeMonthstamp.value![1]).getFullYear()}`
  search.beginTimeMounth = `${new Date(timeMonthstamp.value![0]).getMonth() + 1}`
  search.endTimeMounth = `${new Date(timeMonthstamp.value![1]).getMonth() + 1}`
}

const loading = ref(false)

onMounted(() => {
  instance?.proxy?.$Bus.on('loading', (val: boolean) => {
    loading.value = val
  })
  options.budSubOptions = baseApiListStore.budAccountInfo
  search.beginTimeYear = (new Date().getFullYear() - 2).toString()
  search.endTimeYear = new Date().getFullYear().toString()
  search.beginTimeMounth = (new Date().getMonth() + 1).toString()
  search.endTimeMounth = (new Date().getMonth() + 1).toString()
  const v1 = `${(new Date().getFullYear() - 2).toString()}-${(new Date().getMonth() + 1).toString()}`
  const v2 = `${(new Date().getFullYear()).toString()}-${(new Date().getMonth() + 1).toString()}`
  timeMonthstamp.value = [new Date(v1).getTime(), new Date(v2).getTime()]
  fetchAssetOptionsList()
  fetchBranch()
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
        <n-form-item-gi label="产权结构" span="4" path="assetId">
          <NSelect
            v-model:value="search.assetId" label-field="assetName" value-field="assetId" filterable
            :options="options.assetOptions" placeholder="请选择" clearable
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
            :options="options.deptOptions" placeholder="请选择" clearable
            @click="fetchDept(search.assetId)"
          />
        </n-form-item-gi>

        <n-form-item-gi label="预算类型" span="4" path="feeType">
          <NSelect
            v-model:value="search.feeType" label-field="feeTypeName" value-field="feeType" filterable
            :options="options.feeTypeOptions" placeholder="请选择" clearable
          />
        </n-form-item-gi>

        <n-form-item-gi label="预算事项" span="4" path="compileName">
          <NInput v-model:value="search.compileName" />
        </n-form-item-gi>

        <n-form-item-gi label="科目类型" span="4" path="subjectType">
          <NSelect
            v-model:value="search.subjectType" label-field="budSubjectTypeName" value-field="budSubjectTypeId"
            filterable :options="options.budSubjectTypeOptions" placeholder="请选择" clearable
          />
        </n-form-item-gi>

        <n-form-item-gi label="科目" span="8" path="budSubjectId" mt-10>
          <NCascader
            v-model:value="search.budSubjectId" label-field="budSubjectName" value-field="budSubjectId"
            filterable :options="options.budSubOptions" placeholder="请选择" clearable
          />
        </n-form-item-gi>

        <n-form-item-gi label="级别" span="2" path="budSubjectId" mt-10>
          <NSelect
            v-model:value="search.level" label-field="levelName" value-field="level"
            filterable :options="options.levelOptions" placeholder="请选择" clearable
          />
        </n-form-item-gi>

        <n-form-item-gi label="是否有合同" span="4" path="ifHeTong" mt-10>
          <NSelect
            v-model:value="search.ifHeTong" label-field="ifHeTongName" value-field="ifHeTong"
            filterable :options="options.ifHeTongOption" placeholder="请选择" clearable
          />
        </n-form-item-gi>

        <n-form-item-gi label="日期" span="8" path="timestamp" mt-10>
          <n-date-picker v-model:value="timeMonthstamp" type="monthrange" clearable :style="{ width: '100%' }" @update:value="formatMonthTime" />
        </n-form-item-gi>
      </n-grid>
    </n-form>
    <n-space v-if="currentRouteMetaList.currentRouteMeta.buttons.length === 0 ? false : true">
      <NButton v-if="showBtn('查找', currentRouteMetaList.currentRouteMeta.buttons)" type="primary" @click="searchHandle">
        查找 ( F )
      </NButton>
      <NButton v-if="showBtn('切换数据', currentRouteMetaList.currentRouteMeta.buttons)" type="warning" @click="changeHandle">
        切换数据
      </NButton>
    </n-space>
  </n-space>
</template>

<style scoped></style>

