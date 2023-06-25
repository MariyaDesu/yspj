<script setup lang="ts">
import type { CascaderOption, SelectOption } from 'naive-ui'
import { formatNewsProcess } from '@/utils/common/dropDown'
import { baseApi } from '@/api/baseApi'
import { budgetCompileListApi } from '@/api/budgetApi'
interface IMainData {
  processId?: string
  processName?: string
  deptId?: string
  subjectId?: string
  processCode?: string
  billTypeId?: string
  nodes: Array<any>
  dutyId?: string
  opId?: string
  enable?: number
  branchId?: number
}

interface IData {
  id?: string
  assetId?: string
  deptId?: string
  compileName?: string
  deptName?: string
  assetName?: string
  modalVisible: boolean
  editData: object
  mainData: IMainData
  audit?: boolean
  duty?: boolean
  newData: object
}
const Data: IData = reactive({
  id: '',
  assetId: '',
  deptId: '',
  compileName: '',
  deptName: '',
  assetName: '',
  modalVisible: false,
  editData: {
    nodes: [
      {
        audits: [],
      },
    ],
  },
  mainData: {
    processId: '',
    nodes: [
      {
        audits: [],
      },
    ],
  },
  newData: {},
  audit: false,
  duty: false,

})

const instance = getCurrentInstance()

interface opt {
  deptOptions: CascaderOption[]
  approverOptions: SelectOption[]
  dutyOptions: SelectOption[]
  billTypeOptions: SelectOption[]
  branchOptions: CascaderOption[]
}
const options: opt = reactive({
  deptOptions: [],
  approverOptions: [],
  dutyOptions: [],
  billTypeOptions: [],
  branchOptions: [],
})

async function getBillTypeList() {
  options.billTypeOptions = []
  const res = await baseApi.getBillTypeList({})
  options.billTypeOptions = res.data.list
}
async function fetchUserList() {
  const res = await baseApi.fetchProcessUserList({ })
  options.approverOptions = res.data
}

async function fetchDuty(assetId, deptId) {
  const res = await baseApi.fetchDuty({ assetId, deptId })
  options.dutyOptions = res.data
}
async function editMsg(type: number) {
  if (type === 1) {
    const res = await budgetCompileListApi.saveProcessDetails(
      {
        processId: Data.mainData.processId,
        compileId: Data.id,
        assetId: Data.assetId,
        deptId: Data.deptId,
        billTypeId: 3,
      },
    )
    if (res.code === 200) {
      window.$notification?.success({ title: '提交成功！', duration: 2500 })
      instance?.proxy?.$Bus.emit('fetchData')
      Data.modalVisible = false
    }
    else {
      window.$notification?.warning({ title: `${res.message}`, duration: 2500 })
    }
  }
  else if (type === 0) {
    Data.modalVisible = false
  }
}
onMounted(() => {
  instance?.proxy?.$Bus.on('changeProcessDetails', (row: any) => {
    Data.id = row.id
    Data.assetId = row.assetId
    Data.deptId = row.deptId
    Data.deptName = row.deptName
    Data.compileName = row.compileName
    Data.assetName = row.assetName
    if (row) {
      Data.editData = JSON.parse(JSON.stringify(row.data))
      Object.assign(Data.mainData, Data.editData)
      formatNewsProcess(Data.mainData.nodes)
      nextTick(() => {
        fetchDuty(Data.assetId, Data.deptId)
        fetchUserList()
      })
    }
    else {
      Data.editData = {}
    }
    Data.modalVisible = !Data.modalVisible
    formatNewsProcess(Data.mainData.nodes)
  })

  getBillTypeList()
})
</script>

<template>
  <n-modal
    v-model:show="Data.modalVisible" class="custom-card" preset="card"
    :title="`${JSON.stringify(Data.editData) === '{}' ? '查看' : '查看'}流程`" size="huge"
    :style="{ width: '150vh' }"
  >
    <n-form ref="formRef" label-placement="top" :model="Data.mainData" label-width="120">
      <n-form-item label="产权结构名称" path="assetName">
        <n-input v-model:value="Data.assetName" disabled clearable placeholder="请输入" />
      </n-form-item>
      <n-form-item label="流程名称" path="processName">
        <n-input v-model:value="Data.mainData.processName" disabled clearable placeholder="请输入" />
      </n-form-item>
      <n-form-item label="单据类型" span="6" path="billTypeId">
        <NSelect
          v-model:value="Data.mainData.billTypeId" label-field="billTypeName" disabled value-field="billTypeId" filterable
          :options="options.billTypeOptions" placeholder="请选择"
        />
      </n-form-item>
      <n-form-item label="是否启用" path="string">
        否
        <n-switch
          v-model:value="Data.mainData.enable" ml-5 mr-5 disabled :checked-value="1"
          :unchecked-value="0"
        />
        是
      </n-form-item>
    </n-form>

    <n-card size="small" bg-white>
      <n-timeline size="large" mt-5>
        <n-timeline-item
          v-for="(itemNode, itemIndex) in Data.mainData.nodes"
          :key="itemIndex"
          :type="itemNode.status === 0 ? 'info' : itemNode.status === 1 ? 'error' : itemNode.status === 2 ? 'success' : 'info'"
          :title="itemNode.nodeName"
        >
          <div v-for="(item, index) in itemNode.audits" :key="index" flex flex-row>
            <span v-if="item.auditType === 2 && item.auditTypeId === null" flex-1 mt-10 :style="{ color: 'red' }">缺少审核人</span>
            <n-select
              v-else-if="item.auditType === 2 && item.auditTypeId !== null"
              v-model:value="item.userId"
              flex-1
              mt-5 disabled
              filterable :options="options.approverOptions" label-field="linkmanName"
              value-field="userId" placeholder="请选择" size="small" clearable
            />
            <div w-600 flex>
              <span w-40 ml-10 mt-10>备注</span>
              <n-input v-model:value="item.memo" mt-5 size="small" disabled clearable placeholder="" />
            </div>
          </div>
        </n-timeline-item>
      </n-timeline>
    </n-card>

    <template #footer>
      <NLayout text-center>
        <NButton type="info" mr-10 @click="editMsg(1)">
          提交
        </NButton>
        <NButton type="info" ml-10 @click="editMsg(0)">
          取消
        </NButton>
      </NLayout>
    </template>
  </n-modal>
</template>

<style scoped>

</style>
