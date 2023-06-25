<script setup lang="ts">
import type { SelectOption } from 'naive-ui'
import { baseApi } from '@/api/baseApi'
import { showBtn } from '@/utils/common'
const props = defineProps<{
  buttons: string[]
}>()
interface SearchKey {
  bType?: string
  operaId?: string
  operaDate?: string
}

const search: SearchKey = reactive({
})

const instance = getCurrentInstance()

const searchHandle = () => {
  instance?.proxy?.$Bus.emit('search', search)
}
interface opt {
  bTypeOption: SelectOption[]
  userListOptions: SelectOption[]
}
const options: opt = reactive({
  bTypeOption: [
    {
      bType: 0,
      bTypeName: '菜单',
    },
    {
      bType: 1,
      bTypeName: '角色',
    }, {
      bType: 2,
      bTypeName: '用户',
    }, {
      bType: 3,
      bTypeName: '职位',
    }, {
      bType: 4,
      bTypeName: '部门',
    }, {
      bType: 5,
      bTypeName: '管理结构',
    }, {
      bType: 6,
      bTypeName: '流程',
    },
    {
      bType: 7,
      bTypeName: '产权',
    },
  ],
  userListOptions: [],
})

async function fetchUserList() {
  const res = await baseApi.fetchProcessUserList({})
  // formatSelectDrop(res.data)
  options.userListOptions = res.data
}

// bType(基础资料类型(0菜单 1角色 2 用户 3 职位 4 部门 5管理结构 6 流程))

onMounted(() => {
  fetchUserList()
})
</script>

<template>
  <n-space flex-1 min-w-380>
    <n-form-item label="操作类型" path="bType">
      <n-select
        v-model:value="search.bType" filterable :options="options.bTypeOption" label-field="bTypeName"
        value-field="bType" placeholder="请选择"
      />
    </n-form-item>
    <n-form-item label="操作人" path="operaId">
      <n-select
        v-model:value="search.operaId" filterable :options="options.userListOptions" label-field="linkmanName"
        value-field="userId" placeholder="请选择"
      />
    </n-form-item>
    <n-form-item label="日期" path="operaDate">
      <n-date-picker
        v-model:formatted-value="search.operaDate"
        value-format="yyyy-MM-dd"
        type="date"
        clearable
        placeholder="请输入"
      />
    </n-form-item>
  </n-space>
  <n-space m-auto>
    <NButton v-if="showBtn('查找', props.buttons)" type="primary" @click="searchHandle">
      查找 ( F )
    </NButton>
  </n-space>
</template>

<style scoped>

</style>

