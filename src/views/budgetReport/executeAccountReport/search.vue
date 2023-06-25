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
  beginTime?: string | null
  endTime?: string | null
  level?: number
  ifAuditDate?: number
  ifHeTong?: number
  budInOut?: number
}

const search: ISearch = reactive({})

const Data = reactive({
  type: 0,
})

const instance = getCurrentInstance()

const searchHandle = () => {
  instance?.proxy?.$Bus.emit('search', search)
}

const timestamp = ref<[number, number]>()
interface IOption {
  assetOptions: SelectOption[]
  branchOptions: SelectOption[]
  deptOptions: CascaderOption[]
  feeTypeOptions: SelectOption[]
  budSubjectTypeOptions: SelectOption[]
  budSubOptions: CascaderOption[]
  levelOptions: SelectOption[]
  ifHeTongOption: SelectOption[]
  typeOption: SelectOption[]
  budInOutOption: SelectOption[]
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
    {
      level: 4,
      levelName: '4级',
    },
    {
      level: 5,
      levelName: '5级',
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

  typeOption: [
    {
      type: 0,
      typeName: '科目',
    },
    {
      type: 1,
      typeName: '部门',
    },

  ],

  budInOutOption: [
    {
      budInOut: 1,
      budInOutName: '预算内',
    },
    {
      budInOut: 2,
      budInOutName: '预算外',
    },
    {
      budInOut: 3,
      budInOutName: '所有',
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

function formatTime() {
  if (!timestamp.value) {
    search.beginTime = null
    search.endTime = null
    return
  }
  search.beginTime = `${new Date(timestamp.value[0]).getFullYear()}-${new Date(timestamp.value[0]).getMonth() + 1 >= 10 ? new Date(timestamp.value[0]).getMonth() + 1 : '0' + `${new Date(timestamp.value[0]).getMonth() + 1}`}`
  search.endTime = `${new Date(timestamp.value[1]).getFullYear()}-${new Date(timestamp.value[0]).getMonth() + 1 >= 10 ? new Date(timestamp.value[0]).getMonth() + 1 : '0' + `${new Date(timestamp.value[1]).getMonth() + 1}`}`
}

function changeReport() {
  instance?.proxy?.$Bus.emit('changeReport', Data.type)
}

const loading = ref(false)

onMounted(() => {
  instance?.proxy?.$Bus.on('loading', (val: boolean) => {
    loading.value = val
  })
  options.budSubOptions = baseApiListStore.budAccountInfo
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
        <n-form-item-gi label="产权结构" span="5" path="assetId">
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

        <n-form-item-gi label="预算类型" span="3" path="feeType">
          <NSelect
            v-model:value="search.feeType" label-field="feeTypeName" value-field="feeType" filterable
            :options="options.feeTypeOptions" placeholder="请选择" clearable
          />
        </n-form-item-gi>

        <n-form-item-gi label="预算事项" span="4" path="compileName">
          <NInput v-model:value="search.compileName" />
        </n-form-item-gi>

        <n-form-item-gi label="分类" span="4" path="type">
          <NSelect
            v-model:value="Data.type" label-field="typeName" value-field="type"
            filterable :options="options.typeOption" placeholder="请选择" clearable
            @update:value="changeReport"
          />
        </n-form-item-gi>

        <n-form-item-gi label="科目类型" span="3" path="subjectType" mt-10>
          <NSelect
            v-model:value="search.subjectType" label-field="budSubjectTypeName" value-field="budSubjectTypeId"
            filterable :options="options.budSubjectTypeOptions" placeholder="请选择" clearable
          />
        </n-form-item-gi>

        <n-form-item-gi label="科目" span="5" path="budSubjectId" mt-10>
          <NCascader
            v-model:value="search.budSubjectId" label-field="budSubjectName" value-field="budSubjectId"
            filterable :options="options.budSubOptions" placeholder="请选择" clearable
          />
        </n-form-item-gi>

        <n-form-item-gi label="预算内/外" span="3" path="budInOut" mt-10>
          <NSelect
            v-model:value="search.budInOut" label-field="budInOutName" value-field="budInOut"
            filterable :options="options.budInOutOption" placeholder="请选择" clearable
          />
        </n-form-item-gi>

        <n-form-item-gi label="级别" span="2" path="budSubjectId" mt-10>
          <NSelect
            v-model:value="search.level" label-field="levelName" value-field="level"
            filterable :options="options.levelOptions" placeholder="请选择" clearable
          />
        </n-form-item-gi>

        <n-form-item-gi label="预算周期" span="5" path="timestamp" mt-10>
          <n-date-picker
            v-model:value="timestamp" type="monthrange" clearable :style="{ width: '100%' }"
            @update:value="formatTime"
          />
        </n-form-item-gi>
        <n-form-item-gi label="是否有合同" span="3" path="ifHeTong" mt-10>
          <NSelect
            v-model:value="search.ifHeTong" label-field="ifHeTongName" value-field="ifHeTong"
            filterable :options="options.ifHeTongOption" placeholder="请选择" clearable
          />
        </n-form-item-gi>

        <n-form-item-gi label="包括未审核数据" span="3" path="timestamp" mt-10>
          <n-switch
            v-model:value="search.ifAuditDate" checked-value="1"
            unchecked-value="2"
            default-value="1"
          />
        </n-form-item-gi>
      </n-grid>
    </n-form>
    <n-space v-if="currentRouteMetaList.currentRouteMeta.buttons.length === 0 ? false : true">
      <NButton v-if="showBtn('查找', currentRouteMetaList.currentRouteMeta.buttons)" type="primary" @click="searchHandle">
        查找 ( F )
      </NButton>
    </n-space>
  </n-space>
</template>

<style scoped></style>

