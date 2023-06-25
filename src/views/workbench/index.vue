<script setup lang="ts">
import type { DataTableColumns, SelectOption } from 'naive-ui'
import { NButton } from 'naive-ui'
import budApprovalEdit from './components/budApproval/budApprovalEdit.vue'
import budApprovalEditDetail from './components/budApproval/budApprovalEditDetail.vue'

import budApprovalTable from './components/budApproval/budApprovalTable.vue'
import budCtlApprovalEdit from './components/budCtlApproval/budCtlApprovalEdit.vue'
import budCtlApprovalTable from './components/budCtlApproval/budCtlApprovalTable.vue'
// import AppFooter from '@/components/common/AppFooter.vue'

import VisiTabRankList from './components/VisiTab/VisiTabRankList.vue'
import VisiTabTrend from './components/VisiTab/VisiTabTrend.vue'
import VisiTabStatistical from './components/VisiTab/VisiTabStatistical.vue'

import VisiTabTwoRankList from './components/VisiTab/VisiTabTwoRankList.vue'

import { baseApi } from '@/api/baseApi'
import { useAppStore } from '@/store'
import { formatSelectDrop, renderIcon } from '@/utils/common'

import { processApi } from '@/api/basisSetApi'
// import { CountTo } from '@/components/CountTo'
const appStore = useAppStore()
const tHeight = ref(appStore.tHeight - 220)
interface IOption {
  assetOptions: SelectOption[]
  branchOptions: SelectOption[]

}

const options: IOption = reactive({
  assetOptions: [],
  branchOptions: [],

})
const Data = reactive(
  {
    isAffairs: true,
  },
)
const tableData = ref([])
const timestamp: any = ref()
interface RowData {
  id: string
  processId: string
  instanceId: string
  stepId: string
  auditInfo: string
  memo: string
  status: number
  statusName: string
  billTypeId: number
}

const columns: DataTableColumns<RowData> = [
  { type: 'selection' },
  {
    title: '序号',
    align: 'center',
    width: 80,
    key: 'key',
    render: (_, index) => {
      return `${index + 1}`
    },
  },
  { title: '编码', key: 'processCode', align: 'center', width: 180, ellipsis: { tooltip: true } },
  { title: '流程名称', key: 'processName', align: 'center', width: 180, ellipsis: { tooltip: true } },
  { title: '单据类型', key: 'billTypeName', align: 'center', width: 180, ellipsis: { tooltip: true } },

  {
    title: '操作',
    key: 'actions',
    width: 180,
    align: 'center',
    fixed: 'right',
    render(row) {
      return [
        h(
          NButton,
          {
            size: 'small',
            type: 'primary',
            style: {
              marginRight: '10px',
            },
            onClick: () => handleDetails(row),
          },
          { default: () => '查看详情', icon: renderIcon('material-symbols:arrow-circle-right-outline', { size: 14 }) },
        ),

      ]
    },
  },
]
const loading = ref<boolean>(false)
const instance = getCurrentInstance()

const showMyAffairs = ref(true)
async function showAffairs(isAffairs: boolean) {
  Data.isAffairs = isAffairs
  showMyAffairs.value = false
}
async function handleBack() {
  showMyAffairs.value = true
  searchHandle()
}

async function handleDetails(row: RowData) {
  if (row.billTypeId === 2)
    instance?.proxy?.$Bus.emit('fetchBudApprovalTable', { isAffairs: Data.isAffairs })

  else if (row.billTypeId === 3)
    instance?.proxy?.$Bus.emit('fetchBudCtlTableData', { isAffairs: Data.isAffairs })
}

async function initTableData() {
  loading.value = true
  try {
    const res = await processApi.getProcessList()
    if (res.code === 200)
      tableData.value = res.data.list
  }
  catch (error) {
    console.error(error)
    tableData.value = []
  }
  loading.value = false
}
interface ISearch {
  assetId?: number
  branchId?: number
  beginTime?: string | null
  endTime?: string | null
  feeType?: number
}

const search: ISearch = reactive({})

function formatTime() {
  if (!timestamp.value) {
    search.beginTime = null
    search.endTime = null
    return
  }
  const time = Math.floor((timestamp.value[1] - timestamp.value[0]) / 1000 / 86400 / 30)
  if (time > 12) {
    window.$message?.error('统计周期超过12个月份')
    timestamp.value = null
    return
  }
  const date = new Date(new Date(timestamp.value![0]))
  const year = date.getFullYear()
  const month = date.getMonth() + 1 >= 10 ? date.getMonth() + 1 : '0' + `${date.getMonth() + 1}`
  search.beginTime = `${year}` + '-' + `${month}`

  const date1 = new Date(new Date(timestamp.value![1]))
  const year1 = date1.getFullYear()
  const month1 = date1.getMonth() + 1 >= 10 ? date1.getMonth() + 1 : '0' + `${date1.getMonth() + 1}`
  search.endTime = `${year1}` + '-' + `${month1}`
}
async function fetchAssetOptionsList() {
  const res = await baseApi.getUserAssetSelect({})
  formatSelectDrop(res.data)
  options.assetOptions = res.data
}
async function fetchBranch() {
  const res = await baseApi.getUserBranchSelect({})
  if (res.code === 200) {
    formatSelectDrop(res.data)
    options.branchOptions = res.data
  }
}

async function searchHandle() {
  instance?.proxy?.$Bus.emit('visTabRankList', search)
  instance?.proxy?.$Bus.emit('visTabTrendList', search)
  instance?.proxy?.$Bus.emit('visTabStatisticalList', search)
  instance?.proxy?.$Bus.emit('visTabTwoRankList', search)
}
onMounted(() => {
  initTableData()
  searchHandle()
})

onUnmounted(() => {
  instance?.proxy?.$Bus.all.clear()
})
</script>

<template>
  <div min-w-375>
    <AppPage :show-footer="true" min-w-375>
      <n-space vertical size="large" h-full>
        <n-layout v-if="showMyAffairs" class="bg-[#f5f6fb]">
          <n-grid cols="2" responsive="screen" :x-gap="12" :y-gap="8">
            <n-grid-item>
              <NCard
                hoverable title="我的待办" :segmented="{ content: true, footer: true }" size="small"
                @click="showAffairs(true)"
              >
                <!-- <template #header-extra>
                  <n-tag type="success">
                    日
                  </n-tag>
                </template> -->
                <!-- <div class="py-1 px-1 flex justify-between">
                  <n-skeleton v-if="loading" :width="100" size="medium" />
                  <CountTo v-else :start-val="1" :end-val="1" class="text-3xl" />
                </div> -->
                <template #footer>
                  <div class="flex justify-between">
                    <n-skeleton v-if="loading" text :repeat="2" />
                    <template v-else>
                      <!-- <div class="text-sn">
                        我的待办量：
                      </div>
                      <div class="text-sn">
                        {{ 1 }}
                      </div> -->
                    </template>
                  </div>
                </template>
              </NCard>
            </n-grid-item>
            <n-grid-item>
              <NCard
                hoverable title="我的已办" :segmented="{ content: true, footer: true }" size="small"
                @click="showAffairs(false)"
              >
                <!-- <template #header-extra>
                  <n-tag type="success">
                    日
                  </n-tag>
                </template> -->
                <!-- <div class="py-1 px-1 flex justify-between">
                  <n-skeleton v-if="loading" :width="100" size="medium" />
                  <CountTo v-else :start-val="1" :end-val="50000" class="text-3xl" />
                </div> -->
                <template #footer>
                  <div class="flex justify-between">
                    <n-skeleton v-if="loading" text :repeat="2" />
                    <!-- <template v-else>
                      <div class="text-sn">
                        我的已办量：
                      </div>
                      <div class="text-sn">
                        {{ 2 }}
                      </div>
                    </template> -->
                  </div>
                </template>
              </NCard>
            </n-grid-item>
          </n-grid>
          <n-card mt-20 hoverable>
            <n-space vertical>
              <n-form
                ref="formRef" label-placement="top" :model="search" label-width="100" size="small"
                :show-feedback="false" inline
              >
                <n-grid :cols="24" :x-gap="24">
                  <n-form-item-gi label="产权结构" span="7" path="assetId">
                    <NSelect
                      v-model:value="search.assetId" label-field="assetName" value-field="assetId" filterable
                      :options="options.assetOptions" placeholder="请选择" clearable @click="fetchAssetOptionsList"
                    />
                  </n-form-item-gi>
                  <n-form-item-gi label="管理结构" span="7" path="branchId">
                    <NSelect
                      v-model:value="search.branchId" clearable filterable :options="options.branchOptions"
                      label-field="branchName" value-field="branchId" placeholder="请选择" @click="fetchBranch"
                    />
                  </n-form-item-gi>

                  <n-form-item-gi label="统计周期" span="8" path="timestamp">
                    <n-date-picker
                      v-model:value="timestamp" type="monthrange" clearable :style="{ width: '100%' }"
                      @update:value="formatTime"
                    />
                  </n-form-item-gi>

                  <n-form-item-gi span="2">
                    <NButton type="primary" @click="searchHandle">
                      查找 ( F )
                    </NButton>
                  </n-form-item-gi>
                </n-grid>
              </n-form>
              <n-space />
            </n-space>
            <NCard hoverable mt-20>
              <VisiTabRankList bg-white mt-20 :style="{ minHeight: `${tHeight - 100}px` }" />
              <VisiTabTrend bg-white mt-20 :style="{ minHeight: `${tHeight - 100}px` }" />
              <VisiTabStatistical bg-white mt-20 :style="{ minHeight: `${tHeight - 100}px` }" />
              <VisiTabTwoRankList bg-white mt-20 :style="{ minHeight: `${tHeight - 100}px` }" />
            </NCard>
          </n-card>
        </n-layout>
        <n-layout v-else p-24 :style="{ minHeight: `${tHeight}px` }">
          <n-layout-header flex>
            <n-space flex-1 m-auto text-16 font-600>
              {{ Data.isAffairs ? "待办事项" : '已办事项' }}
            </n-space>

            <n-space m-auto>
              <NButton type="primary" @click="handleBack">
                <template #icon>
                  <icon-icon-park-outline:return />
                </template>
                返回
              </NButton>
            </n-space>
          </n-layout-header>
          <n-data-table
            mt-20 single-column striped :columns="columns" :row-key="(row: RowData) => row.id"
            :data="tableData" :loading="loading" :scroll-x="1000"
          />
        </n-layout>
      </n-space>
    </AppPage>
    <budApprovalEdit />
    <budApprovalEditDetail />
    <budApprovalTable />
    <budCtlApprovalEdit />
    <budCtlApprovalTable />
  </div>
</template>
