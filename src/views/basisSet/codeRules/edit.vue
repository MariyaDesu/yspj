<script setup lang="ts">
import type { FormInst, SelectOption } from 'naive-ui'
import { rules } from './common'
import { budCodeSettingApi } from '@/api/basisSetApi'
interface list {
  businessObjectType?: number
  codeName?: string
  separators?: number | null
  codingType?: number
  codingOneVal?: string
  codingTwoVal?: string
  codingThreeVal?: string
  startCode?: string
  codeSettingCode?: string
}
interface dataList {
  modalVisible: boolean
  editData: object
  mainData: list

}
const Data = reactive<dataList>({

  modalVisible: false,
  editData: {},
  mainData: {
    codeSettingCode: '否',
  },
})
const formRef = ref<FormInst | null>(null)
const instance = getCurrentInstance()
function fetchTableData() {
  instance?.proxy?.$Bus.emit('fetchData')
}
async function editMsg(type: number) {
  if (type === 1) {
    formRef.value?.validate(async (errors) => {
      if (!errors) {
        const res = JSON.stringify(Data.editData) === '{}'
          ? await budCodeSettingApi.saveAddBudCodeSetting(
            Data.mainData,
          )
          : await budCodeSettingApi.saveEditBudCodeSetting(
            Data.mainData,
          )

        if (res.code === 200) {
          window.$notification?.success({ title: '保存成功！', duration: 2500 })
          Data.modalVisible = false
        }

        else { window.$notification?.warning({ title: `${res.message}`, duration: 2500 }) }

        fetchTableData()
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
interface opt {
  businessObjectTypeOption: SelectOption[]
  codingTypeOption: SelectOption[]
  separatorOptions: SelectOption[]
}

const options: opt = reactive({
  businessObjectTypeOption: [
    {
      businessObjectTypeId: 1,
      businessObjectTypeName: '预算录入',
    },
    {
      businessObjectTypeId: 2,
      businessObjectTypeName: '预算调整',
    },
    {
      businessObjectTypeId: 3,
      businessObjectTypeName: '支付登记',
    },
    {
      businessObjectTypeId: 4,
      businessObjectTypeName: '收入登记',
    },
    {
      businessObjectTypeId: 5,
      businessObjectTypeName: '调整登记',
    },
  ],
  codingTypeOption: [
    {
      codingTypeId: 0,
      codingTypeName: '年',
    },
    {
      codingTypeId: 1,
      codingTypeName: '年月',
    },
    {
      codingTypeId: 2,
      codingTypeName: '年月日',
    },
  ],
  separatorOptions: [
    {
      separatorId: 1,
      separatorName: '-',
    },
  ],
})

onMounted(() => {
  instance?.proxy?.$Bus.on('edit', (row: any) => {
    row ? Data.editData = JSON.parse(JSON.stringify(row)) : Data.editData = {}
    Data.modalVisible = !Data.modalVisible
    Data.mainData = {
      codeSettingCode: '否',
    }
    Object.assign(Data.mainData, Data.editData)
    if (Data.mainData.separators === 0)
      Data.mainData.separators = null
  })
  // fetchAreaList()
  // fetchDeptState()
})
</script>

<template>
  <n-modal
    v-model:show="Data.modalVisible" class="custom-card" preset="card"
    :title="`${JSON.stringify(Data.editData) === '{}' ? '新增' : '编辑'}编号规则`" size="huge"
    :style="{ width: '50vw' }"
  >
    <n-form ref="formRef" label-placement="top" :model="Data.mainData" label-width="120" require-mark-placement="left" :rules="rules">
      <n-form-item label="单据类型" path="businessObjectType">
        <n-select
          v-model:value="Data.mainData.businessObjectType" filterable :options="options.businessObjectTypeOption"
          label-field="businessObjectTypeName" value-field="businessObjectTypeId" placeholder="请选择" clearable
        />
      </n-form-item>
      <n-form-item label="单据简称" path="codeName">
        <n-input v-model:value="Data.mainData.codeName" clearable placeholder="请输入" />
      </n-form-item>
      <n-form-item label="是否附加产权编码" path="string">
        否
        <n-switch v-model:value="Data.mainData.codeSettingCode" default-value="Data.mainData.codeSettingCode" ml-5 mr-5 checked-value="是" unchecked-value="否" />
        是
      </n-form-item>
      <n-form-item label="编码方式" path="codingType">
        <n-select
          v-model:value="Data.mainData.codingType" filterable :options="options.codingTypeOption"
          label-field="codingTypeName" value-field="codingTypeId" placeholder="请选择" clearable
        />
      </n-form-item>

      <!-- <n-form-item label="编码方式值1" path="codingOneVal">
        <n-input v-model:value="Data.mainData.codingOneVal" clearable placeholder="请输入" :disabled="Data.flag" />
      </n-form-item>
      <n-form-item label="编码方式值2" path="codingTwoVal">
        <n-input v-model:value="Data.mainData.codingTwoVal" clearable placeholder="请输入" :disabled="Data.flag" />
      </n-form-item>
      <n-form-item label="编码方式值3" path="codingThreeVal">
        <n-input v-model:value="Data.mainData.codingThreeVal" clearable placeholder="请输入" :disabled="Data.flag || Data.mainData.codingType !== 2" />
      </n-form-item> -->
      <n-form-item label="分割符" path="separators">
        <n-select
          v-model:value="Data.mainData.separators" filterable :options="options.separatorOptions"
          label-field="separatorName" value-field="separatorId" placeholder="请选择" clearable
        />
      </n-form-item>
      <n-form-item label="起始编号" path="startCode">
        <n-input v-model:value="Data.mainData.startCode" clearable placeholder="请输入" />
      </n-form-item>
    </n-form>
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

<style scoped>

</style>
