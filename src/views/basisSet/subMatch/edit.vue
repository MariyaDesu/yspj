<script setup lang="ts">
import type { CascaderOption, FormInst, SelectOption } from 'naive-ui'
import { NButton, NCascader, NSelect } from 'naive-ui'
import { rules } from './common'
import { accountSubApi, deptManagementApi, subMatchApi } from '@/api/basisSetApi'
import { budgetEntryApi } from '@/api/budgetApi'
import { useAppStore, useBaseApiListStore } from '@/store'

const baseApiListStore = useBaseApiListStore()
const appStore = useAppStore()
const tHeight = ref(appStore.tHeight - 520)

const Data: any = reactive({
  modalVisible: false,
  visible: false,
  accDisable: false,
  deptData: [],
  mainData: {},
  editData: {},
  search: {},
  page: {
    pageNum: 1,
    pageSize: 10,
    totalPage: 0,
  },
  params: {
    pageNum: 0,
    pageSize: 0,
  },
})
const deptData: any = ref([])
const xDeptTable: any = ref(null)
const xTable: any = ref(null)
const loading = ref(false)
interface IOption {
  budSubMenuOptions: CascaderOption[] // 预算科目
  accSubMenuOptions: CascaderOption[] // 会计科目
  isAssistOptions: SelectOption[]
}
const options: IOption = reactive({
  budSubMenuOptions: [],
  accSubMenuOptions: [],
  isAssistOptions: [
    {
      ifAuxiliary: '是',
      ifAuxiliaryName: '是',
    }, {
      ifAuxiliary: '否',
      ifAuxiliaryName: '否',
    },
  ],
})

const instance = getCurrentInstance()
function fetchTableData() {
  instance?.proxy?.$Bus.emit('fetchData')
}

function handleAdd() {
  if (Data.mainData.ifAuxiliary === '否') {
    window.$message?.error('当前非辅助核算,无法添加数据')
    return
  }
  Data.visible = true
}

function handleDelete() {
  const $table = xTable.value
  if ($table) {
    $table.removeCheckboxRow()
    Data.mainData.budSubjectBindingsChild = $table.getTableData().tableData
  }
}
const formRef = ref<FormInst | null>(null)
const editMsg = async () => {
  formRef.value?.validate(async (errors) => {
    if (!errors) {
      const res = JSON.stringify(Data.editData) === '{}'
        ? await subMatchApi.saveAddSubMatch(
          Data.mainData,
        )
        : await subMatchApi.saveEditSubMatch(
          Data.mainData,

        )
      if (res.code === 200) {
        window.$notification?.success({ title: '保存成功！', duration: 2500 })
        fetchTableData()
        Data.modalVisible = false
      }
      else {
        window.$notification?.error({ title: res.message, duration: 2500 })
      }
    }
    else {
      window.$message?.error('请填写必填项')
    }
  })
}

const editSaveDept = () => {
  const $table = xDeptTable.value
  const $table1 = xTable.value
  if ($table) {
    const selectRecords = $table.getCheckboxRecords()
    selectRecords.forEach((item) => {
      $table1.insertAt(item)
    })
    Data.mainData.budSubjectBindingsChild = $table1.getTableData().tableData
  }
  Data.visible = false
}

// 初始化数据
async function initDeptData() {
  loading.value = true
  try {
    Data.params.pageNum = Data.page.pageNum
    Data.params.pageSize = Data.page.pageSize
    const res = await deptManagementApi.getDeptManagementList(Data.params)
    if (res.code === 200) {
      deptData.value = res.data.list
      Data.page.pageNum = res.data.pageNum
      Data.page.pageSize = res.data.pageSize
      Data.page.totalPage = res.data.totalPage
    }
  }
  catch (error) {
    console.error(error)
    deptData.value = []
  }

  loading.value = false
}

async function setaccount(scope) {
  const id = Data.mainData.budSubjectBindingsChild[scope.$rowIndex].budAccountantSubjectId
  const res = await accountSubApi.getBudgetEntryList({ id })
  if (res.code === 200) {
    if (res.data[0]) { Data.mainData.budSubjectBindingsChild[scope.$rowIndex].budAccountantSubjectDirection = res.data[0].balanceDirectionName }

    else {
      Data.mainData.budSubjectBindingsChild[scope.$rowIndex].budAccountantSubjectId = null
      Data.mainData.budSubjectBindingsChild[scope.$rowIndex].budAccountantSubjectDirection = null
    }
  }
}
// 设置发生额方向
async function directionOfAccrual(id) {
  if (!id) {
    Data.mainData.budSubjectDirection = null
    return
  }
  const res = await budgetEntryApi.getBudgetEntryList({ id })
  if (res.code === 200)
    Data.mainData.budSubjectDirection = res.data[0].balanceDirectionName
}
// 设置余额方向
async function directionOfBalance(id) {
  if (!id) {
    Data.mainData.budAccountantSubjectDirection = null
    return
  }
  const res = await accountSubApi.getBudgetEntryList({ id })
  if (res.code === 200) {
    if (res.data[0]) { Data.mainData.budAccountantSubjectDirection = res.data[0].balanceDirectionName }

    else {
      Data.mainData.budAccountantSubjectId = null
      Data.mainData.budAccountantSubjectDirection = null
    }
  }
}

function cleanBudAcc(v) {
  if (v === '是') {
    Data.mainData.budAccountantSubjectId = null
    Data.mainData.budAccountantSubjectDirection = null
    Data.accDisable = true
  }
  else {
    Data.mainData.budSubjectBindingsChild = []
    Data.accDisable = false
  }
}

function pageChange(val) {
  Data.page.pageNum = val
  initDeptData()
}
function pageSizeChange(val) {
  Data.page.pageNum = 1
  Data.page.pageSize = val
  initDeptData()
}

function searchHandle() {
  Data.page.pageNum = 1
  Data.params = { ...Data.search }
  initDeptData()
}

onMounted(() => {
  instance?.proxy?.$Bus.on('edit', async (row: any) => {
    row ? Data.editData = JSON.parse(JSON.stringify(row)) : Data.editData = {}

    Data.mainData = {}
    Data.mainData.budSubjectBindingsChild = []
    Object.assign(Data.mainData, Data.editData)
    options.budSubMenuOptions = baseApiListStore.budAccountInfo
    options.accSubMenuOptions = baseApiListStore.accountSubInfo
    initDeptData()

    if (row)
      Data.mainData = row
    cleanBudAcc(Data.mainData.ifAuxiliary)
    Data.modalVisible = !Data.modalVisible
  })
})
</script>

<template>
  <n-modal
    v-model:show="Data.modalVisible" class="custom-card" preset="card"
    :title="`${JSON.stringify(Data.editData) === '{}' ? '新增' : '编辑'}科目匹配`" size="huge"
  >
    <n-card>
      <n-layout-header flex>
        <n-space flex-1 m-auto text-16 font-600>
          基本数据
        </n-space>
      </n-layout-header>
      <n-form
        ref="formRef" mt-20 label-placement="top" :model="Data.mainData" label-width="120"
        require-mark-placement="left" :rules="rules"
      >
        <n-grid :cols="24" :x-gap="24">
          <n-form-item-gi label="预算科目编码" span="8" path="budSubjectId">
            <NCascader
              v-model:value="Data.mainData.budSubjectId" label-field="budSubjectName" value-field="budSubjectId"
              :show-path="false" check-strategy="child" children-field="children" filterable
              :options="options.budSubMenuOptions" clearable @update:value="directionOfAccrual"
            />
          </n-form-item-gi>
          <n-form-item-gi label="发生额方向" span="8" path="budSubjectDirection">
            <NInput v-model:value="Data.mainData.budSubjectDirection" disabled clearable placeholder="" />
          </n-form-item-gi>
          <n-form-item-gi label="是否辅助核算" span="8" path="ifAuxiliary">
            <NSelect
              v-model:value="Data.mainData.ifAuxiliary" label-field="ifAuxiliaryName" value-field="ifAuxiliary"
              filterable :options="options.isAssistOptions" placeholder="请选择" @update:value="cleanBudAcc"
            />
          </n-form-item-gi>
          <n-form-item-gi label="会计科目编码" span="8" path="budAccountantSubjectId">
            <NCascader
              v-model:value="Data.mainData.budAccountantSubjectId" label-field="accountantSubjectName"
              :disabled="Data.accDisable" value-field="accountantSubjectId" check-strategy="child" :show-path="false"
              children-field="children" filterable :options="options.accSubMenuOptions" clearable
              @update:value="directionOfBalance"
            />
          </n-form-item-gi>
          <n-form-item-gi label="余额方向" span="8" path="budAccountantSubjectDirection">
            <NInput v-model:value="Data.mainData.budAccountantSubjectDirection" disabled clearable placeholder="" />
          </n-form-item-gi>
        </n-grid>
      </n-form>
    </n-card>
    <n-card mt-10>
      <n-layout-header flex>
        <n-space flex-1 m-auto text-16 font-600>
          辅助核算
        </n-space>
        <n-space m-auto>
          <NButton type="primary" @click="handleAdd">
            <template #icon>
              <!-- <icon-icon-park-outline:return /> -->
            </template>
            添加
          </NButton>
          <NButton type="primary" @click="handleDelete">
            <template #icon>
              <!-- <icon-icon-park-outline:return /> -->
            </template>
            删除
          </NButton>
        </n-space>
      </n-layout-header>
      <vxe-table
        ref="xTable" mt-20 :height="tHeight" :loading="loading
        " border :tree-config="{
          indent: 16,
          trigger: 'cell',
        }" :column-config="{ resizable: true }" :data="Data.mainData.budSubjectBindingsChild"
        class="mytable-scrollbar"
      >
        <vxe-column type="checkbox" width="60" fixed="left" />
        <vxe-column type="seq" width="60" title="序号" />
        <vxe-column field="deptCode" title="部门编码" width="300" />
        <vxe-column field="deptName" title="部门名称" width="250" />
        <vxe-column field="accountantSubjectId" title="会计科目编码" width="400">
          <template #default="scope">
            <NCascader
              v-model:value="Data.mainData.budSubjectBindingsChild[scope.$rowIndex].budAccountantSubjectId"
              label-field="accountantSubjectName" check-strategy="child" value-field="accountantSubjectId"
              :show-path="false" children-field="children" filterable :options="options.accSubMenuOptions" clearable
              @update:value="setaccount(scope)"
            />
          </template>
        </vxe-column>
        <vxe-column field="budAccountantSubjectDirection" title="余额方向" width="" />
      </vxe-table>
    </n-card>

    <template #footer>
      <NLayout text-center>
        <NButton type="info" mr-10 @click="editMsg">
          保存
        </NButton>
        <NButton type="info" ml-10 @click="Data.modalVisible = false">
          取消
        </NButton>
      </NLayout>
    </template>
  </n-modal>

  <n-modal v-model:show="Data.visible" class="custom-card" preset="card" title="部门列表" size="huge">
    <n-card>
      <n-layout-header flex>
        <n-space flex-1 m-auto text-16 font-600>
          <n-form inline :label-width="80" size="small" :show-feedback="false">
            <n-form-item label="部门编码">
              <n-input v-model:value="Data.search.deptCode" />
            </n-form-item>
            <n-form-item label="部门名称">
              <n-input v-model:value="Data.search.deptName" />
            </n-form-item>
          </n-form>
        </n-space>
        <n-space m-auto>
          <NButton type="primary" size="small" @click="searchHandle">
            查找 ( F )
          </NButton>
        </n-space>
      </n-layout-header>
      <vxe-table
        ref="xDeptTable" :height="tHeight + 200" mt-20 :loading="loading
        " border :tree-config="{
          indent: 16,
          trigger: 'cell',

        }" :column-config="{ resizable: true }" :data="deptData" class="mytable-scrollbar"
      >
        <vxe-column type="checkbox" width="60" fixed="left" />
        <vxe-column type="seq" width="60" title="序号" />
        <vxe-column field="deptCode" title="部门编码" width="250" />
        <vxe-column field="deptName" title="部门名称" width="150" />
      </vxe-table>
    </n-card>
    <n-pagination
      v-model:page="Data.page.pageNum" v-model:page-size="Data.page.pageSize"
      :page-count="Data.page.totalPage" size="large" show-quick-jumper show-size-picker :page-sizes="[10, 20, 50, 100]"
      :on-update:page="pageChange" :on-update:page-size="pageSizeChange" f-r-r mt-10
    />
    <template #footer>
      <NLayout text-center>
        <NButton type="info" mr-10 @click="editSaveDept">
          保存
        </NButton>
        <NButton type="info" ml-10 @click="Data.visible = false">
          取消
        </NButton>
      </NLayout>
    </template>
  </n-modal>
</template>

<style scoped></style>
