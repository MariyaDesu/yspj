<script setup lang="ts">
import type { DataTableColumns, FormInst } from 'naive-ui'

import { NButton } from 'naive-ui'
import { sysDictionaryApi } from '@/api/sysManaApi'
import { baseApi } from '@/api/baseApi'
import { renderIcon } from '@/utils/common'
import { useAppStore } from '@/store'
const appStore = useAppStore()
const tHeight = ref(appStore.tHeight - 320)
interface RowData {
  code: string
  dictname: string
  enabled: number
  id: number
  remark: string
  ifCorrelation: string
}
const loading = ref<boolean>(false)
const tableData = ref()
const Data = reactive({
  modalVisible: false,
  show: false,
  isEdit: false,
  checkedRowKeys: [],
  mainData: {
    dictValue: '',
    ifCorrelation: '0',
    dictId: '',
  },
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

const columns: DataTableColumns<RowData> = [
  {
    title: '序号',
    align: 'center',
    width: 60,
    key: 'key',
    render: (_, index) => {
      return `${index + 1}`
    },
  },
  {
    title: '名称',
    key: 'dictValue',
    width: 120,
    align: 'center',
    ellipsis: { tooltip: true },
  },
  {
    title: '是否关联银行账号',
    key: 'ifCorrelation',
    width: 220,
    align: 'center',
    ellipsis: { tooltip: true },
    render: (row, index) => {
      return row.ifCorrelation === '0' ? '不关联' : '关联'
    },
  },

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
            type: 'info',
            style: {
              marginLeft: '2px',
              marginRight: '2px',
            },
            onClick: () => handleEdit(row),
          },
          { default: () => '编辑', icon: renderIcon('material-symbols:edit', { size: 14 }) },
        ),
        h(
          NButton,
          {
            size: 'small',
            type: 'error',
            style: {
              marginLeft: '2px',
              marginRight: '2px',
            },
            onClick: () => handleDelete(row),
          },
          { default: () => '删除', icon: renderIcon('material-symbols:delete-outline', { size: 14 }) },
        ),
      ]
    },
  },
]
const instance = getCurrentInstance()

function handleAdd() {
  Data.isEdit = false
  Data.show = true
}

function handleEdit(row) {
  Data.isEdit = true
  Data.show = true
  Data.mainData = { ...row }
}

async function handleDelete(row) {
  const params = { dictName: row.dictName, dictValue: row.dictValue }
  window.$dialog?.warning({
    title: '确认删除？',
    negativeText: '取消',
    positiveText: '确认',
    onPositiveClick: async () => {
      const res = await sysDictionaryApi.deleteDictionaryDetail(params)
      if (res.code === 200) {
        window.$message?.success('删除成功')
        getDictionaryDetailByKeyWord()
      }

      else {
        window.$message?.error(`${res.message}`)
      }
    },
    onNegativeClick: () => {
      window.$message?.success('已取消')
    },
  })
}
const formRef = ref<FormInst | null>(null)
// 保存
const editMsgs = async (type: number) => {
  formRef.value?.validate(async (errors) => {
    if (!errors) {
      if (type === 1) {
        Data.mainData.dictId = tableData.value[0].dictId
        const res = Data.isEdit
          ? await sysDictionaryApi.updateDictionaryDetail(
            Data.mainData,
          )
          : await sysDictionaryApi.addDictionaryDetail(
            Data.mainData,
          )

        if (res.code === 200) {
          window.$notification?.success({ title: '保存成功！', duration: 2500 })
          Data.show = false
        }

        else { window.$notification?.warning({ title: `${res.data}`, duration: 2500 }) }

        getDictionaryDetailByKeyWord()
      }

      else if (type === 0) {
        Data.show = false
      }
    }
    else {
      window.$message?.error('请填写必填项')
    }
  })
}
async function getDictionaryDetailByKeyWord() {
  const res = await baseApi.getDictionaryDetailByKeyWord({ keyWord: '支付方式' })
  tableData.value = res.data
}

onMounted(() => {
  instance?.proxy?.$Bus.on('changeDictionaryEdit', (row: any) => {
    getDictionaryDetailByKeyWord()
    Data.modalVisible = !Data.modalVisible
  })
})
</script>

<template>
  <n-modal
    v-model:show="Data.modalVisible" class="custom-card" preset="card"
    size="huge"
  >
    <n-layout-header flex>
      <n-space flex-1 m-auto text-16 font-600>
        修改字典
      </n-space>
      <n-space m-auto>
        <NButton type="primary" @click="handleAdd">
          <template #icon>
            <!-- <icon-icon-park-outline:return /> -->
          </template>
          添加
        </NButton>
      </n-space>
    </n-layout-header>
    <n-data-table
      v-model:checked-row-keys="Data.checkedRowKeys"
      mt-10
      striped
      :columns="columns"
      :row-key="(row: RowData) => row.dictname"
      :data="tableData"
      :loading="loading"
      flex-height
      :style="{ minHeight: `${tHeight}px` }"
    />
  </n-modal>

  <n-modal
    v-model:show="Data.show" class="custom-card" preset="card"
    size="huge" :style="{ width: '50vw' }"
  >
    <n-form ref="formRef" label-placement="top" :model="Data.mainData" label-width="120">
      <n-form-item :span="12" label="名称" path="branchCode">
        <n-input v-model:value="Data.mainData.dictValue" placeholder="请输入名称" clearable />
      </n-form-item>
      <n-form-item label="是否关联银行账号" path="string">
        否
        <n-switch
          v-model:value="Data.mainData.ifCorrelation" ml-5 mr-5 checked-value="1"
          unchecked-value="0"
        />
        是
      </n-form-item>
    </n-form>

    <template #footer>
      <NLayout text-center>
        <NButton type="info" mr-10 @click="editMsgs(1)">
          保存
        </NButton>
        <NButton type="info" ml-10 @click="editMsgs(0)">
          取消
        </NButton>
      </NLayout>
    </template>
  </n-modal>
</template>

<style scoped>

</style>

