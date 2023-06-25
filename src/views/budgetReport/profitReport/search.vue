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
  beginTimeYear?: number
  endTimeYear?: number
  beginTimeMounth?: number
  endTimeMounth?: number
  level?: number
  ifHeTong?: number
  budInOut?: number
}

const search: ISearch = reactive({
  // ifHeTong: 4,
})

const instance = getCurrentInstance()

const searchHandle = () => {
  if (search.beginTimeMounth === null)
    search.beginTimeMounth = 1
  if (search.endTimeMounth === null)
    search.endTimeMounth = 12
  // search.beginTimeYear ? 1 : search.beginTimeYear
  instance?.proxy?.$Bus.emit('search', search)
}

const changeHandle = () => {
  instance?.proxy?.$Bus.emit('change')
}

interface IOption {
  assetOptions: SelectOption[]
  branchOptions: SelectOption[]
  deptOptions: CascaderOption[]
  feeTypeOptions: SelectOption[]
  budSubjectTypeOptions: SelectOption[]
  budSubOptions: CascaderOption[]
  levelOptions: SelectOption[]
  ifHeTongOption: SelectOption[]
  monthOption: SelectOption[]
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
  monthOption: [
    {
      month: 1,
      monthName: '1月',
    },
    {
      month: 2,
      monthName: '2月',
    },
    {
      month: 3,
      monthName: '3月',
    },
    {
      month: 4,
      monthName: '4月',
    },
    {
      month: 5,
      monthName: '5月',
    },
    {
      month: 6,
      monthName: '6月',
    },
    {
      month: 7,
      monthName: '7月',
    },
    {
      month: 8,
      monthName: '8月',
    },
    {
      month: 9,
      monthName: '9月',
    },
    {
      month: 10,
      monthName: '10月',
    },
    {
      month: 11,
      monthName: '11月',
    },
    {
      month: 12,
      monthName: '12月',
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

const loading = ref(false)
const beginTimeYear = ref(null)
const endTimeYear = ref(null)

function formattedYear() {
  search.endTimeYear = new Date(endTimeYear.value as unknown as number).getFullYear()
}
onMounted(() => {
  instance?.proxy?.$Bus.on('loading', (val: boolean) => {
    loading.value = val
  })

  options.budSubOptions = baseApiListStore.budAccountInfo

  const v1 = `${(new Date().getFullYear()).toString()}-${(new Date().getMonth() + 1).toString()}`
  const v2 = `${(new Date().getFullYear()).toString()}-${(new Date().getMonth() + 1).toString()}`

  beginTimeYear.value = new Date(v1).getTime() as any
  endTimeYear.value = new Date(v2).getTime() as any
  search.beginTimeYear = (new Date().getFullYear())
  search.endTimeYear = (new Date().getFullYear())
  search.beginTimeMounth = (new Date().getMonth() + 1)
  search.endTimeMounth = (new Date().getMonth() + 1)
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

        <n-form-item-gi label="预算类型" span="4" path="feeType">
          <NSelect
            v-model:value="search.feeType" label-field="feeTypeName" value-field="feeType" filterable
            :options="options.feeTypeOptions" placeholder="请选择" clearable
          />
        </n-form-item-gi>

        <n-form-item-gi label="预算事项" span="4" path="compileName">
          <NInput v-model:value="search.compileName" />
        </n-form-item-gi>

        <n-form-item-gi label="科目类型" span="3" path="subjectType">
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

        <n-form-item-gi label="是否有合同" span="3" path="ifHeTong" mt-10>
          <NSelect
            v-model:value="search.ifHeTong" label-field="ifHeTongName" value-field="ifHeTong"
            filterable :options="options.ifHeTongOption" placeholder="请选择" clearable
          />
        </n-form-item-gi>

        <n-form-item-gi label="预算内/外" span="3" path="budInOut" mt-10>
          <NSelect
            v-model:value="search.budInOut" label-field="budInOutName" value-field="budInOut"
            filterable :options="options.budInOutOption" placeholder="请选择" clearable
          />
        </n-form-item-gi>

        <n-form-item-gi label="日期" span="8" mt-10>
          <n-date-picker v-model:value="endTimeYear" type="year" clearable w-120 @update:value="formattedYear" />
          <NSelect
            v-model:value="search.beginTimeMounth" label-field="monthName" value-field="month" filterable
            :options="options.monthOption" placeholder="起始月份" clearable w-150
          />
          <NSelect
            v-model:value="search.endTimeMounth" label-field="monthName" value-field="month" filterable
            :options="options.monthOption" placeholder="起始月份" clearable w-150
          />
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

