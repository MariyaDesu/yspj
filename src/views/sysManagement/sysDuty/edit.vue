<script setup lang="ts">
import type { FormInst } from 'naive-ui'
import { rules } from './common'
import { sysDutyApi } from '@/api/sysManaApi'
interface list {
  enable?: string
  dutyName?: string
  dutyCode?: string
  sort?: number
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
    enable: '0',
  },
})

const instance = getCurrentInstance()
function fetchTableData() {
  instance?.proxy?.$Bus.emit('fetchData')
}

const formRef = ref<FormInst | null>(null)
async function editMsg(type: number) {
  if (type === 1) {
    formRef.value?.validate(async (errors) => {
      if (!errors) {
        if (type === 1) {
          const res = JSON.stringify(Data.editData) === '{}'
            ? await sysDutyApi.saveAddDuty(
              Data.mainData,
            )
            : await sysDutyApi.saveEditDuty(
              Data.mainData,
            )

          if (res.code === 200) {
            window.$notification?.success({ title: '保存成功！', duration: 2500 })
            Data.modalVisible = false
          }

          else { window.$notification?.warning({ title: `${res.message}`, duration: 2500 }) }

          fetchTableData()
        }

        else if (type === 0) {
          Data.modalVisible = false
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

onMounted(() => {
  instance?.proxy?.$Bus.on('edit', (row: any) => {
    row ? Data.editData = JSON.parse(JSON.stringify(row)) : Data.editData = {}
    Data.modalVisible = !Data.modalVisible
    Data.mainData = {
      enable: '0',
    }
    Object.assign(Data.mainData, Data.editData)
  })
})
</script>

<template>
  <n-modal
    v-model:show="Data.modalVisible" class="custom-card" preset="card"
    :title="`${JSON.stringify(Data.editData) === '{}' ? '新增' : '编辑'}审批角色`" size="huge"
    :style="{ width: '50vw' }"
  >
    <n-form ref="formRef" label-placement="top" :model="Data.mainData" label-width="120" require-mark-placement="left" :rules="rules">
      <n-form-item label="审批角色编码" path="dutyCode">
        <n-input v-model:value="Data.mainData.dutyCode" clearable wh-full placeholder="请输入" :show-button="false" />
      </n-form-item>
      <n-form-item label="审批角色名称" path="dutyName">
        <n-input v-model:value="Data.mainData.dutyName" clearable placeholder="请输入" />
      </n-form-item>
      <n-form-item label="排序" path="sort">
        <n-input-number v-model:value="Data.mainData.sort" clearable wh-full placeholder="请输入" :show-button="false" />
      </n-form-item>

      <n-form-item label="是否启用" path="string">
        否
        <n-switch
          v-model:value="Data.mainData.enable" ml-5 mr-5 :checked-value="1"
          :unchecked-value="0"
        />
        是
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
