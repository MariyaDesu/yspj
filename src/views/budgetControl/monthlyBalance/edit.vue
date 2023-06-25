<script setup lang="ts">
import type { DataTableColumns, FormInst } from 'naive-ui'
import { NButton, NInput } from 'naive-ui'
import avatar from '@/assets/images/userPic.jpg'
import { payRegApi } from '@/api/budgetControlApi'
import { useAppStore } from '@/store'
import { workBenchApi } from '@/api/workbench'
const appStore = useAppStore()
const tHeight = ref(appStore.tHeight - 110)

interface list {
  budControlPayCode?: string
  payType?: number | null
  dictValue?: string
  bankAccountNumber?: string
  bankName?: string
  budPayId?: string
  payTime?: string
  assetId?: string
  branchId?: string
  abstracts?: string
  budPayMoney?: string
  budControlPayList?: Array<any>
  feeType?: number
  ifCorrelation?: string
  createdName?: string
  modifiedName?: string
}
interface dataList {
  modalVisible: boolean
  editData: object
  mainData: list
  name: string
  showTable: boolean
  oldtable?: Array<any>
  keyIndex: number
  summary?: number
  fileIndex: number
}

const loading = ref<boolean>(false)
const Data: dataList = reactive({
  modalVisible: false,
  editData: {},
  mainData: {},
  name: '',
  oldtable: [],
  showTable: false,
  keyIndex: 0,
  fileIndex: 0,
})
interface lists {
  processName?: string
  deptId?: string
  subjectId?: string
  processCode?: string
  steps: Array<any>
  dutyId?: string
  opId?: string
  enable?: number
  auditInfo?: string
  instanceId?: string
  createdTime?: string
  createdName?: string
  status?: number
}

interface dataLists {
  modalVisible: boolean
  editData: object
  mainData: lists
  audit?: boolean
  duty?: boolean
  newData: object
  flag: boolean

}

const Datas = reactive<dataLists>({
  modalVisible: false,
  editData: {
    steps: [
      {
        executes: [],
      },
    ],
  },
  mainData: {
    steps: [
      {
        executes: [],
      },
    ],
  },
  newData: {},
  audit: false,
  duty: false,
  flag: true,

})

const tableData = ref()

interface RowData {
  budSubjectId: string
  budInOut: string
  compileCode: string
  eachAmount: number
  commission: number
  actualAmount: number
  budCompileId: string
}

const columns: DataTableColumns<RowData> = [
  { type: 'selection' },
  {
    title: '预算内/外',
    align: 'center',
    width: 100,
    key: 'budInOutName',
  },

  {
    title: '预算编号',
    align: 'center',
    width: 180,
    key: 'compileCode',
  },

  {
    title: '预算事项明细',
    align: 'center',
    width: 180,
    key: 'matter',
  },

  {
    title: '预算科目',
    align: 'center',
    width: 180,
    key: 'codeAndName',
  },
  {
    title: '期间时间',
    key: 'periodDate',
    align: 'center',
    width: 180,
    ellipsis: { tooltip: true },
  },
  {
    title: '收入金额',
    key: 'eachAmount',
    align: 'center',
    width: 180,
    ellipsis: { tooltip: true },
  },
  {
    title: '手续费',
    key: 'commission',
    align: 'center',
    width: 180,
    ellipsis: { tooltip: true },
  },
  {
    title: '实际收入金额',
    key: 'actualAmount',
    align: 'center',
    width: 180,
    ellipsis: { tooltip: true },
  },
]

const instance = getCurrentInstance()

const formRef = ref<FormInst | null>(null)

function fetchTableData() {
  instance?.proxy?.$Bus.emit('fetchBudApprovalTableData')
}

async function editMsg(type: number) {
  const newArr = Datas.mainData.steps.find((element) => {
    return element.status === 0
  })
  if (type === 1) {
    if (newArr) {
      // const res = await workBenchApi.passAffairs({ instanceId: newArr.instanceId, stepId: newArr.stepId, status: 2, auditInfo: Datas.mainData.auditInfo })
      const res = await workBenchApi.passAffairs({ instanceId: newArr.instanceId, status: 2, auditInfo: Datas.mainData.auditInfo ?? '通过' })

      if (res.code === 200) {
        window.$notification?.success({ title: '保存成功！', duration: 2500 })

        fetchTableData()
        Data.modalVisible = false
      }
      else {
        Object.assign(Datas.mainData, Datas.editData)

        window.$notification?.warning({ title: `${res.message}`, duration: 2500 })
      }
    }
    else {
      window.$notification?.warning({ title: '该节点已被通过！', duration: 2500 })
    }
  }
  else if (type === 0) {
    const res = await workBenchApi.passAffairs({ instanceId: Datas.mainData.instanceId, status: 1, auditInfo: Datas.mainData.auditInfo ?? '不通过' })

    if (res.code === 200) {
      window.$notification?.success({ title: '保存成功！', duration: 2500 })

      fetchTableData()
      Data.modalVisible = false
    }
    else {
      Object.assign(Data.mainData, Data.editData)
      window.$notification?.warning({ title: `${res.message}`, duration: 2500 })
    }
  }
  else if (type === 2) {
    const res = await workBenchApi.batchRecall({ instanceId: Datas.mainData.instanceId })
    if (res.code === 200) {
      window.$notification?.success({ title: '撤回成功！', duration: 2500 })

      fetchTableData()
      Data.modalVisible = false
    }
    else {
      Object.assign(Data.mainData, Data.editData)
      window.$notification?.warning({ title: `${res.message}`, duration: 2500 })
    }
  }
}

onMounted(() => {
  instance?.proxy?.$Bus.on('changeAppAffairs', (value: any) => {
    Datas.flag = value.flag
    if (value.row)
      Datas.editData = JSON.parse(JSON.stringify(value.row))
    else
      Datas.editData = {}
    Datas.mainData = {
      processCode: '',
      processName: '',
      deptId: '',
      subjectId: '',
      steps: [
        {
          nodeName: '',
          level: '',
          priority: '',
          totalQty: '',
          prevNodeId: '',
          nextNodeId: '',
          memo: '',
          executes: [
            {
              opId: '',
              auditType: '',
            },
          ],
        },
      ],
    }
    Object.assign(Datas.mainData, Datas.editData)
  })
})

function isPassed(step, type) {
  if (type === 1) {
    if (step.status === 1)
      return true

    return false
  }
  if (type === 2) {
    if (step.status === 2)
      return true

    return false
  }

  // return true
}
onMounted(() => {
  instance?.proxy?.$Bus.on('edit', async (row: any) => {
    // 编辑
    loading.value = true
    const res = await payRegApi.getPayRegList({ budControlPayCode: row.row.compileCode })
    if (res.code === 200) {
      Data.mainData = {}
      Data.modalVisible = !Data.modalVisible
      loading.value = false
      Data.editData = res.data.list[0]
      Object.assign(Data.mainData, Data.editData)
      tableData.value = res.data.list[0].budControlPayList
    }
    else {
      window.$notification?.warning({ title: `${res.message}`, duration: 2500 })
    }
  })
  // Data.modalVisible = !Data.modalVisible
})
</script>

<template>
  <n-modal
    v-model:show="Data.modalVisible" class="custom-card" preset="card" title="查看审批详情" size="huge"
  >
    <n-layout has-sider :style="{ minHeight: `${tHeight}px` }">
      <n-layout-content :native-scrollbar="false" mr-20>
        <n-card>
          <n-form
            ref="formRef" label-placement="top" :model="Data.mainData" label-width="auto"
            require-mark-placement="left"
          >
            <n-grid :cols="24" :x-gap="24">
              <n-form-item-gi label="调整编号" span="6">
                <NInput v-model:value="Data.mainData.budControlPayCode" disabled clearable placeholder="请输入" />
              </n-form-item-gi>
              <n-form-item-gi label="调整方式" span="6">
                <NInput v-model:value="Data.mainData.dictValue" disabled clearable placeholder="请输入" />
              </n-form-item-gi>
              <n-form-item-gi label="银行账号" span="6">
                <NInput v-model:value="Data.mainData.bankAccountNumber" disabled clearable placeholder="请输入" />
              </n-form-item-gi>
              <n-form-item-gi label="银行名称" span="6">
                <NInput v-model:value="Data.mainData.bankName" disabled clearable placeholder="请输入" />
              </n-form-item-gi>
              <n-form-item-gi label="调整日期" span="6">
                <NInput v-model:value="Data.mainData.payTime" disabled clearable placeholder="请输入" />
              </n-form-item-gi>
              <n-form-item-gi label="总金额" span="6">
                <NInput v-model:value="Data.mainData.budPayMoney" disabled clearable placeholder="请输入" />
              </n-form-item-gi>
              <n-form-item-gi label="编制说明" span="12">
                <NInput v-model:value="Data.mainData.abstracts" disabled clearable placeholder="请输入" />
              </n-form-item-gi>
            </n-grid>
          </n-form>
        </n-card>

        <n-card mt-10>
          <n-data-table
            :style="{ minHeight: `${tHeight - 350}px` }" flex-height
            default-expand-all single-column striped :columns="columns"
            :row-key="(row: RowData) => row.compileCode" :data="tableData" :loading="loading" :scroll-x="1400"
          />
        </n-card>
        <n-card mt-10>
          <n-layout>
            <n-form inline :label-width="120" :model="Data.mainData" label-placement="left" :show-feedback="false">
              <n-grid :cols="24" :x-gap="24">
                <n-form-item-gi span="8" label="编制人名称">
                  <NInput v-model:value="Data.mainData.createdName" disabled clearable placeholder="请输入" />
                </n-form-item-gi>
                <n-form-item-gi span="8" label="创建人名称">
                  <NInput v-model:value="Data.mainData.createdName" disabled clearable placeholder="请输入" />
                </n-form-item-gi>
                <n-form-item-gi span="8" label="编辑人名称">
                  <NInput v-model:value="Data.mainData.modifiedName" disabled clearable placeholder="请输入" />
                </n-form-item-gi>
              </n-grid>
            </n-form>
          </n-layout>
        </n-card>
      </n-layout-content>
      <n-layout-sider collapse-mode="width" :collapsed-width="0" width="35%" bordered :native-scrollbar="false">
        <n-card class="isPassSVG" :style="{ fontSize: '10px', minHeight: `${Datas.mainData.steps.length * 120 > tHeight ? Datas.mainData.steps.length * 120 : tHeight}px` }" size="small" bg-white>
          <div flex justify-between>
            <div :style="{ fontSize: '16px' }">
              发起人：{{ Datas.mainData.createdName }}
            </div>
            <div :style="{ fontSize: '16px' }">
              发起时间：{{ Datas.mainData.createdTime }}
            </div>
          </div>
          <n-timeline size="large" mt-5>
            <template v-for="(itemNode, itemIndex) in Datas.mainData.steps" :key="itemIndex">
              <n-timeline-item
                v-if="itemNode.nodeType === 1" :key="itemIndex"
                :type="itemNode.status === 0 ? 'info' : itemNode.status === 1 ? 'error' : itemNode.status === 2 ? 'success' : 'info'"
                :title="`${itemNode.auditName}` + '       ·       '
                  + `${itemNode.status === 0 ? '审批中' : itemNode.status === 1
                    ? '未通过' : itemNode.status === 2 ? '已通过' : '未审批'}`
                "
              >
                <div v-for="(i, index) in itemNode.executes" :key="index" flex flex-row>
                  <img :src="avatar" mr10 w-35 h-35 rounded-full>
                  <n-ellipsis w-100 mt-10>
                    {{ i.opName }}
                  </n-ellipsis>
                  <n-ellipsis flex1 w-150 ml-10 mt-10>
                    审批意见：{{ i.auditInfo }}
                  </n-ellipsis>
                  <n-ellipsis w-200 ml-10 mt-10>
                    审批时间：{{ i.executeTime }}
                  </n-ellipsis>
                </div>
              </n-timeline-item>
            </template>
          </n-timeline>
          <n-timeline size="large" mt-5>
            <template v-for="(itemNode, itemIndex) in Datas.mainData.steps" :key="itemIndex">
              <n-timeline-item
                v-if="itemNode.nodeType === 2" :key="itemIndex"
                :type="itemNode.status === 0 ? 'info' : itemNode.status === 1 ? 'error' : itemNode.status === 2 ? 'success' : 'info'"
                :title="`${itemNode.auditName}` + '       ·       '
                  + `${itemNode.status === 0 ? '审批中' : itemNode.status === 1
                    ? '未通过' : itemNode.status === 2 ? '已通过' : '未审批'}`
                "
              >
                <div v-for="(i, index) in itemNode.executes" :key="index" flex flex-row>
                  <img :src="avatar" mr10 w-35 h-35 rounded-full>
                  <n-ellipsis w-100 mt-10>
                    {{ i.opName }}
                  </n-ellipsis>
                  <n-ellipsis flex1 w-150 ml-10 mt-10>
                    审批意见：{{ i.auditInfo }}
                  </n-ellipsis>
                  <n-ellipsis w-200 ml-10 mt-10>
                    审批时间：{{ i.executeTime }}
                  </n-ellipsis>
                </div>
              </n-timeline-item>
            </template>
          </n-timeline>
          <n-timeline size="large" mt-5>
            <template v-for="(itemNode, itemIndex) in Datas.mainData.steps" :key="itemIndex">
              <n-timeline-item
                v-if="itemNode.nodeType === 3" :key="itemIndex"
                :type="itemNode.status === 0 ? 'info' : itemNode.status === 1 ? 'error' : itemNode.status === 2 ? 'success' : 'info'"
                :title="`${itemNode.auditName}` + '       ·       '
                  + `${itemNode.status === 0 ? '审批中' : itemNode.status === 1
                    ? '未通过' : itemNode.status === 2 ? '已通过' : '未审批'}`
                "
              >
                <div v-for="(i, index) in itemNode.executes" :key="index" flex flex-row>
                  <img :src="avatar" mr10 w-35 h-35 rounded-full>
                  <n-ellipsis w-100 mt-10>
                    {{ i.opName }}
                  </n-ellipsis>
                  <n-ellipsis flex1 w-150 ml-10 mt-10>
                    审批意见：{{ i.auditInfo }}
                  </n-ellipsis>
                  <n-ellipsis w-200 ml-10 mt-10>
                    审批时间：{{ i.executeTime }}
                  </n-ellipsis>
                </div>
              </n-timeline-item>
            </template>
          </n-timeline>
          <n-timeline size="large" mt-5>
            <template v-for="(itemNode, itemIndex) in Datas.mainData.steps" :key="itemIndex">
              <n-timeline-item
                v-if="itemNode.nodeType === 4" :key="itemIndex"
                :type="itemNode.status === 0 ? 'info' : itemNode.status === 1 ? 'error' : itemNode.status === 2 ? 'success' : 'info'"
                :title="`${itemNode.auditName}` + '       ·       '
                  + `${itemNode.status === 0 ? '审批中' : itemNode.status === 1
                    ? '未通过' : itemNode.status === 2 ? '已通过' : '未审批'}`
                "
              >
                <div v-for="(i, index) in itemNode.executes" :key="index" flex flex-row>
                  <img :src="avatar" mr10 w-35 h-35 rounded-full>
                  <n-ellipsis w-100 mt-10>
                    {{ i.opName }}
                  </n-ellipsis>
                  <n-ellipsis flex1 w-150 ml-10 mt-10>
                    审批意见：{{ i.auditInfo }}
                  </n-ellipsis>
                  <n-ellipsis w-200 ml-10 mt-10>
                    审批时间：{{ i.executeTime }}
                  </n-ellipsis>
                </div>
              </n-timeline-item>
            </template>
          </n-timeline>

          <img v-if="isPassed(Datas.mainData, 1)" :style="{ float: 'right' }" src="@/assets/svg/passNoProess.svg" style="width: 150px; height: 150px">
          <img v-if="isPassed(Datas.mainData, 2)" :style="{ float: 'right' }" src="@/assets/svg/passProess.svg" style="width: 150px; height: 150px">
        </n-card>
      </n-layout-sider>
    </n-layout>
    <n-card v-if="Datas.flag && (Datas.mainData.status !== 1 && Datas.mainData.status !== 2)" title="审批意见" flex-shrink-0 mt-10 cursor-pointer>
      <NInput
        v-model:value="Datas.mainData.auditInfo" mt-10 clearable placeholder="请输入" type="textarea"
        autosize :style="{ height: '5vh' }"
      />
      <template #footer>
        <NLayout text-center>
          <NButton type="info" mr-5 w-80 @click="editMsg(1)">
            通过
          </NButton>
          <NButton type="info" w-80 @click="editMsg(2)">
            撤回
          </NButton>
          <NButton type="info" ml-5 w-80 @click="editMsg(0)">
            不通过
          </NButton>
        </NLayout>
      </template>
    </n-card>
  </n-modal>
</template>

<style scoped>
/* :deep(th) {
  font-weight: bold !important;
} */

:deep(.n-card-header) {
  padding-top: 3px;
  padding-bottom: 0px;
  padding-left: 10px;
  font-size: 21px;
}

isPassSVG{
  background: url('@/assets/svg/passProess.svg') no-repeat
}
</style>

