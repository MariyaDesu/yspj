<script setup lang="ts">
import type { SelectOption } from 'naive-ui'
import { showBtn } from '@/utils/common'
const props = defineProps<{
  buttons: string[]
}>()

interface searchKey {
  businessObjectType?: string
}

const search: searchKey = reactive({
})

const instance = getCurrentInstance()
const editHandle = () => {
  instance?.proxy?.$Bus.emit('edit')
}

const searchHandle = () => {
  instance?.proxy?.$Bus.emit('search', search)
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
      businessObjectTypeName: '预算编制',
    },
    {
      businessObjectTypeId: 2,
      businessObjectTypeName: '预算调整',
    },
    {
      businessObjectTypeId: 3,
      businessObjectTypeName: '支付登记',
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
// const branchOptions: SelectOption[] = reactive([])
// const deptOptions: SelectOption[] = reactive([])

const loading = ref(false)

onMounted(() => {
  instance?.proxy?.$Bus.on('loading', (val: boolean) => {
    loading.value = val
  })
})
</script>

<template>
  <n-space vertical>
    <n-space>
      <n-form
        inline
        :label-width="80"
        size="small"
        :show-feedback="false"
      >
        <n-form-item label="单据类型" path="businessObjectType">
          <n-select
            v-model:value="search.businessObjectType" filterable :options="options.businessObjectTypeOption"
            label-field="businessObjectTypeName" value-field="businessObjectTypeId" placeholder="请选择"
          />
        </n-form-item>
      </n-form>
    </n-space>
    <n-space v-if="props.buttons.length === 0 ? false : true">
      <NButton v-if="showBtn('新增', props.buttons)" type="warning" @click="editHandle">
        <template #icon>
          <icon-material-symbols-add />
        </template>
        新增
      </NButton>
      <NButton v-if="showBtn('查找', props.buttons)" type="primary" @click="searchHandle">
        查找 ( F )
      </NButton>
    </n-space>
  </n-space>
</template>

<style scoped>

</style>

