<script setup lang="ts">
import type { CascaderOption, DataTableColumns, FormInst, SelectOption } from 'naive-ui'
import { NButton, NCascader, NInput, NInputNumber, NSelect } from 'naive-ui'
import { rules } from './common'
import { baseApi } from '@/api/baseApi'

import { keepTwoDecimalStr, renderIcon } from '@/utils/common'

import { payRegApi } from '@/api/budgetControlApi'
import { useAppStore, useBaseApiListStore } from '@/store'
const baseApiListStore = useBaseApiListStore()
const appStore = useAppStore()
const tHeight = ref(appStore.tHeight)
interface opt {
  payTypeOptions: SelectOption[]
  budInOutOptions: SelectOption[]
  budCompileOptions: SelectOption[]
  matterOptions: [
    SelectOption[],
  ]
  budSubOptions: [
    CascaderOption[],
  ]
  bankNameOptions: SelectOption[]
}
const options: opt = reactive({
  payTypeOptions: [],
  budInOutOptions: [
    {
      budInOut: 1,
      budInOutName: ' 预算内',
    }, {
      budInOut: 2,
      budInOutName: ' 预算外',
    }, {
      budInOut: 3,
      budInOutName: '/',
    },
  ],
  budCompileOptions: [],
  matterOptions: [
    [],
  ],
  budSubOptions: [
    [],
  ],
  bankNameOptions: [],

})
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
  deptId?: string
  abstracts?: string
  budPayMoney?: string
  budControlPayList?: Array<any>
  feeType?: number
  ifCorrelation?: string
}
interface dataList {
  modalVisible: boolean
  editData: object
  mainData: list
  flag: boolean
  editFlag: boolean
}
const loading = ref<boolean>(false)
const Data: dataList = reactive({
  modalVisible: false,
  editData: {},
  mainData: {},
  flag: true,
  editFlag: false,
})
interface RowData {
  budSubjectId: string
  budInOut: string
  compileCode: string
  eachAmount: number
  budCompileId: string
}
const tableData = ref()

const columns: DataTableColumns<RowData> = [
  { type: 'selection' },
  {
    title: '预算内/外',
    align: 'center',
    width: 180,
    key: 'budInOut',
    render(row, index) {
      return [
        h(
          NSelect,
          {
            labelField: 'budInOutName',
            valueField: 'budInOut',
            value: row.budInOut,
            clearable: true,
            options: options.budInOutOptions,
            async onUpdateValue(v) {
              tableData.value[index].budInOut = v
              tableData.value[index].compileCode = ''
              tableData.value[index].budCompileId = ''
              tableData.value[index].budSubjectId = ''
              tableData.value[index].periodDate = ''
            },
          },
        ),
      ]
    },
  },

  {
    title: '预算编号',
    align: 'center',
    width: 180,
    key: 'compileCode',
    render(row, index) {
      return [
        h(
          NSelect,
          {
            disabled: tableData.value[index].budInOut === 2 || tableData.value[index].budInOut === 3,
            labelField: 'compileCode',
            valueField: 'compileCode',
            value: row.compileCode,
            clearable: true,
            filterable: true,
            options: options.budCompileOptions,
            async onUpdateValue(v) {
              tableData.value[index].compileCode = v
              tableData.value[index].budCompileId = ''
              tableData.value[index].budSubjectId = ''
              tableData.value[index].periodDate = ''
              await selectBudCompileBelowSubject(v, index)
            },
          },
        ),
      ]
    },
  },

  {
    title: '预算事项明细',
    align: 'center',
    width: 180,
    key: 'budCompileId',
    render(row, index) {
      return [
        h(
          NSelect,
          {
            labelField: 'matter',
            valueField: 'budCompileId',
            value: row.budCompileId,
            clearable: true,
            hidden: tableData.value[index].budInOut === 2 || tableData.value[index].budInOut === 3,
            options: options.matterOptions[index],
            async onUpdateValue(v) {
              tableData.value[index].budCompileId = v
              tableData.value[index].budSubjectId = ''
              tableData.value[index].periodDate = ''
              await selectBudSubjectNameCodeList(v, index)
            },
            async onclick() {
              if (!tableData.value[index].compileCode)
                return
              await selectBudCompileBelowSubject(tableData.value[index].compileCode, index)
            },
          },
        ),
        h(
          NInput, {
            hidden: tableData.value[index].budInOut === 1 || tableData.value[index].budInOut === null,
            value: row.budCompileId,
            onUpdateValue(v) {
              tableData.value[index].budCompileId = v
              tableData.value[index].budSubjectId = ''
              tableData.value[index].periodDate = ''
            },

          },

        ),
      ]
    },
  },

  {
    title: '预算科目',
    align: 'center',
    width: 180,
    key: 'budSubjectId',
    render(row, index) {
      return [
        h(
          NCascader,
          {
            disabled: tableData.value[index].budInOut === 1,
            labelField: 'codeAndName',
            valueField: 'budSubjectId',
            value: row.budSubjectId,
            checkStrategy: 'child',
            clearable: true,
            options: options.budSubOptions[index],
            async onUpdateValue(v) {
              tableData.value[index].budSubjectId = v
            },
            onclick() {
              if (tableData.value[index].budInOut === 2 || tableData.value[index].budInOut === 3)
                options.budSubOptions[index] = baseApiListStore.budAccountInfo
            },
          },
        ),
      ]
    },
  },
  {
    title: '期间时间',
    key: 'periodDate',
    align: 'center',
    width: 180,
    ellipsis: { tooltip: true },
  },
  {
    title: '支付金额',
    key: 'eachAmount',
    align: 'center',
    width: 180,
    ellipsis: { tooltip: true },
    render(row, index) {
      return [
        h(
          NInputNumber, {
            value: row.eachAmount,
            showButton: false,
            min: 0,
            clearable: true,
            onUpdateValue(v) {
              tableData.value[index].eachAmount = v
            },
            onBlur() {
              let num = 0
              const val = 0
              const toFixedNum = tableData.value[index].eachAmount?.toFixed(3)
              tableData.value[index].eachAmount = toFixedNum?.substring(0, toFixedNum.lastIndexOf('.') + 3) || val.toFixed(3).substring(0, val.toFixed(3).lastIndexOf('.') + 3)
              tableData.value.forEach((item: any) => {
                if (item.eachAmount)
                  num = num + Number(item.eachAmount)
              })
              Data.mainData.budPayMoney = num.toFixed(3).substring(0, num.toFixed(3).lastIndexOf('.') + 3)
            },

          },

        ),
      ]
    },
  },
  {
    title: '操作',
    key: 'actions',
    width: 140,
    align: 'center',
    fixed: 'right',
    render(row, index) {
      return [
        h(
          NButton,
          {
            size: 'small',
            type: 'error',
            style: {
              marginLeft: '10px',
            },
            onClick: () => handleDelete(row, index),
          },
          { default: () => '删除', icon: renderIcon('material-symbols:delete-outline', { size: 14 }) },
        ),
      ]
    },
  },
]
const instance = getCurrentInstance()
function fetchTableData() {
  instance?.proxy?.$Bus.emit('fetchData')
}
const formRef = ref<FormInst | null>(null)
async function editMsg(type: number) {
  if (type === 1) {
    formRef.value?.validate(async (errors) => {
      if (!errors) {
        if (!Data.mainData.bankAccountNumber && Data.mainData.payType !== 1) {
          window.$message?.error('请输入银行账号')
          return
        }
        Data.mainData.feeType = 2
        let num = 0
        tableData.value.forEach((item) => {
          item.eachAmount = item.eachAmount || keepTwoDecimalStr(0)
          num = num + (item.eachAmount || keepTwoDecimalStr(0)) * 1
        })

        Data.mainData.budPayMoney = num < 0 ? `-${keepTwoDecimalStr(Math.abs(num))}` : keepTwoDecimalStr(num)

        const res
          = !Data.editFlag
            ? await payRegApi.saveAddbudControlPay(Data.mainData)
            : await payRegApi.saveEditbudControlPay(Data.mainData)

        if (res.code === 200) {
          window.$notification?.success({ title: '保存成功！', duration: 2500 })
          fetchTableData()
          Data.modalVisible = false
        }
        else {
          if (res.message === '该支付编码已存在') {
            await fetchCode()
            await editMsg(1)
          }

          else { window.$notification?.warning({ title: `${res.message}`, duration: 2500 }) }
        }
      }
      else {
        window.$message?.error('请填写必填项')
      }
    })
  }
  else if (type === 0) {
    Data.modalVisible = false
  }
}

async function getDictionaryDetailByKeyWord() {
  const res = await baseApi.getDictionaryDetailByKeyWord({ keyWord: '支付方式' })
  options.payTypeOptions = res.data
}

function handleAdd() {
  tableData.value.push({
    budInOut: null,
  })
}

function handleDelete(row, index) {
  tableData.value.splice(index, 1)
  options.matterOptions.splice(index, 1)
  options.budSubOptions.splice(index, 1)
  let num = 0
  tableData.value.forEach((item) => {
    num = num * 1 + (item.eachAmount || keepTwoDecimalStr(0)) * 1
  })
  Data.mainData.budPayMoney = num < 0 ? `-${keepTwoDecimalStr(Math.abs(num))}` : keepTwoDecimalStr(num)

  if (row.budInOut === 1)
    options.matterOptions[index] = []
}

async function selectBudCompile() {
  const res = await payRegApi.selectBudCompile({ feeType: 2, assetId: Data.mainData.assetId, branchId: Data.mainData.branchId, deptId: Data.mainData.deptId })
  if (res.code === 200)
    options.budCompileOptions = res.data
}
async function selectBudCompileBelowSubject(v, index) {
  if (!v)
    return

  const res = await payRegApi.selectBudCompileBelowSubject({ code: v, assetId: Data.mainData.assetId, branchId: Data.mainData.branchId, deptId: Data.mainData.deptId })
  if (res.code === 200)
    options.matterOptions[index] = res.data
}

async function selectBudSubjectNameCodeList(v, index) {
  if (!v)
    return
  const res = await payRegApi.selectBudSubjectNameCodeList({ code: tableData.value[index].compileCode, budCompileId: v })
  if (res.code === 200) {
    options.budSubOptions[index] = res.data
    tableData.value[index].budSubjectId = res.data[0].budSubjectId
    tableData.value[index].periodDate = res.data[0].periodDate
  }
}

async function keyCheck() {
  if (Data.mainData.budControlPayCode) {
    const res = await payRegApi.selectIfExist({ code: Data.mainData.budControlPayCode, type: 3, feeType: 2, assetId: Data.mainData.assetId ?? '' })
    if (res.code === 200)
      window.$notification?.success({ title: `${res.data}`, duration: 2500 })

    else window.$notification?.warning({ title: `${res.message}`, duration: 2500 })
  }
}
async function selectListByBankType() {
  const res = await payRegApi.selectListByBankType({ assetId: Data.mainData.assetId, branchId: Data.mainData.branchId })
  if (res.code === 200)
    options.bankNameOptions = res.data
}

async function selectListByBankAccountNumber(bankAccountNumber) {
  if (!bankAccountNumber)
    return
  Data.mainData.bankName = ''
  const res = await payRegApi.selectListByBankAccountNumber({ bankAccountNumber })
  if (res.code === 200) {
    Data.mainData.bankName = res.data[0].bankName
    Data.mainData.budPayId = res.data[0].budPayId
  }
}

function clear() {
  options.payTypeOptions.forEach((item: any) => {
    if (item.keyValue === Data.mainData.payType)
      Data.mainData.ifCorrelation = item.ifCorrelation
  })
  Data.mainData.bankAccountNumber = ''
  Data.mainData.bankName = ''
  Data.mainData.budPayId = ''
}

async function fetchCode() {
  const res = await payRegApi.fetchCode({ type: 3, feeType: 2, assetId: Data.mainData.assetId ?? '' })
  if (res.code === 200)
    Data.mainData.budControlPayCode = res.data
}

onMounted(() => {
  instance?.proxy?.$Bus.on('edit', (row: any) => {
    row ? Data.editData = JSON.parse(JSON.stringify(row)) : Data.editData = {}
    Data.modalVisible = !Data.modalVisible
    Data.mainData = {}
    tableData.value = []
    Object.assign(Data.mainData, Data.editData)

    Data.editFlag = false
    options.budSubOptions = [
      [],
    ]
    if (row.budControlPayId) {
      Data.editFlag = true
      tableData.value = Data.mainData.budControlPayList
      options.payTypeOptions = [
        {
          dictValue: Data.mainData.dictValue,
          keyValue: Data.mainData.payType,
        },
      ]
      tableData.value.forEach((item, index) => {
        options.matterOptions[index] = [
          {
            budCompileId: item.budCompileId,
            matter: item.matter,
          },
        ]

        options.budSubOptions[index] = [
          {
            budSubjectId: item.budSubjectId,
            codeAndName: item.codeAndName,
          },
        ]
        // selectBudCompileBelowSubject(item.compileCode, index)
      })
    }
    else {
      const date = new Date()
      const year = date.getFullYear()
      const month = date.getMonth() + 1 >= 10 ? date.getMonth() + 1 : '0' + `${date.getMonth() + 1}`
      const day = date.getDate() >= 10 ? date.getDate() : '0' + `${date.getDate()}`
      Data.mainData.payTime = `${year}` + '-' + `${month}` + '-' + `${day}`
      Data.mainData.budControlPayList = tableData.value
      fetchCode()
    }
    selectBudCompile()
    // getDictionaryDetailByKeyWord()
  })
})
</script>

<template>
  <n-modal
    v-model:show="Data.modalVisible" class="custom-card" preset="card"
    :title="`支付登记${!Data.editFlag ? '录入' : '编辑'}`" size="huge"
    :style="{ minHeight: `${tHeight}px` }"
  >
    <n-card title="基本数据">
      <n-form
        ref="formRef" label-placement="top" :model="Data.mainData" label-width="120" require-mark-placement="left"
        :rules="rules"
      >
        <n-grid :cols="24" :x-gap="24">
          <n-form-item-gi label="支付编号" span="6" path="budControlPayCode">
            <NInput
              v-model:value="Data.mainData.budControlPayCode" clearable placeholder="请输入" :disabled="Data.editFlag"
              @blur="keyCheck"
            />
          </n-form-item-gi>
          <n-form-item-gi label="支付方式" span="6" path="payType">
            <NSelect
              v-model:value="Data.mainData.payType" filterable :options="options.payTypeOptions"
              label-field="dictValue" value-field="keyValue" placeholder="请选择" @click="getDictionaryDetailByKeyWord"
              @update:value="clear"
            />
          </n-form-item-gi>

          <n-form-item-gi label="银行账号" span="6" path="bankAccountNumber">
            <NSelect
              v-model:value="Data.mainData.bankAccountNumber" filterable :options="options.bankNameOptions"
              label-field="bankAccountNumber" value-field="bankAccountNumber" placeholder="请选择"
              :disabled="Data.mainData.ifCorrelation === '0'"
              @click="selectListByBankType()"
              @update:value="selectListByBankAccountNumber(Data.mainData.bankAccountNumber)"
            />
          </n-form-item-gi>
          <!-- <n-form-item-gi label="产权结构名称" span="6" path="assetName">
                    <NInput v-model:value="Data.mainData.assetName" clearable placeholder="请输入" disabled />
                  </n-form-item-gi>
                  <n-form-item-gi label="管理结构名称" span="6" path="branchName">
                    <NInput v-model:value="Data.mainData.branchName" clearable placeholder="请输入" disabled />
                  </n-form-item-gi> -->
          <n-form-item-gi label="银行名称" span="6" path="bankName">
            <NInput v-model:value="Data.mainData.bankName" clearable placeholder="请输入" disabled />
          </n-form-item-gi>

          <n-form-item-gi label="制定日期" span="6" path="payTime">
            <n-date-picker
              v-model:formatted-value="Data.mainData.payTime" value-format="yyyy-MM-dd" type="date" clearable
              placeholder="请输入" :style="{ width: '100%' }"
            />
          </n-form-item-gi>
          <n-form-item-gi label="支付总金额" span="6" path="budPayMoney">
            <NInput
              v-model:value="Data.mainData.budPayMoney"
              disabled clearable wh-full placeholder="请输入"
              :show-button="false"
            />
          </n-form-item-gi>

          <n-form-item-gi label="摘要" span="12" path="abstracts">
            <NInput v-model:value="Data.mainData.abstracts" clearable placeholder="请输入" />
          </n-form-item-gi>
        </n-grid>
      </n-form>
    </n-card>
    <n-card mt-10>
      <n-layout-header flex>
        <n-space flex-1 m-auto text-16 font-600>
          单据数据
        </n-space>
        <n-space m-auto>
          <NButton type="primary" @click="handleAdd">
            <template #icon>
              <!-- <icon-icon-park-outline:return /> -->
            </template>
            添加一行
          </NButton>
        </n-space>
      </n-layout-header>
      <n-data-table
        default-expand-all single-column striped :columns="columns"
        :row-key="(row: RowData) => row.compileCode" :data="tableData" :loading="loading"
        :scroll-x="2000"
      />
    </n-card>

    <template #footer>
      <NLayout text-center>
        <NButton type="info" mr-10 @click="editMsg(1)">
          保存
        </NButton>
        <NButton type="info" ml-10 @click="editMsg(0)">
          取消
        </NButton>
      </NLayout>
    </template>
  </n-modal>
</template>

