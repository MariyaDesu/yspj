<script setup lang="ts">
import type { TreeOption } from 'naive-ui'
import { NButton } from 'naive-ui'

import { showBtn } from '@/utils/common'
import { useAppStore, useBaseApiListStore } from '@/store'

const props = defineProps<{
  buttons: string[]
}>()

const baseApiListStore = useBaseApiListStore()

const appStore = useAppStore()
const tHeight = ref(appStore.tHeight - 220)
// 树形数据
/**
 * data 树形数据
 * pattern 搜索keyValue
 * nodeProps 节点事件
 */
const loading = ref(false)
const data = ref<TreeOption[]>([])
const pattern = ref()
const keyVal = ref()
const nodeProps = ({ option }: { option: TreeOption }) => {
  return {
    onClick() {
      keyVal.value = option
      getBudgetEntryList(option)
    },
  }
}
// 新增菜单
const instance = getCurrentInstance()
function addSubject() {
  instance?.proxy?.$Bus.emit('edit', { type: true, keyVal: {} })
}

function getBudgetEntryList(option: any) {
  instance?.proxy?.$Bus.emit('fetchBudEntryTableData', option.id)
}

onMounted(() => {
  loading.value = true
  data.value = baseApiListStore.accountSubInfo
  keyVal.value = ''
  loading.value = false
})
instance?.proxy?.$Bus.on('fetchMenuTableData', () => {
  initTableData()
})

async function initTableData() {
  loading.value = true
  try {
    await baseApiListStore.getAccountSubSubjectList().then((res) => {
      data.value = res
    })
    loading.value = false
  }
  catch (error) {
    console.error(error)
    loading.value = false
    data.value = []
  }
}

watch(() => baseApiListStore.accountSubInfo, (newval, oldval) => {
  data.value = baseApiListStore.accountSubInfo
})
</script>

<template>
  <n-space vertical :size="12" pr-10>
    <div flex>
      <n-input v-model:value="pattern" placeholder="搜索" />
      <NButton v-if="showBtn('新增', props.buttons)" type="primary" ml-5 @click="addSubject">
        <template #icon>
          <icon-material-symbols-add />
        </template>
        新增
      </NButton>
    </div>
    <n-spin :show="loading">
      <n-tree
        :style="{ minHeight: `${tHeight}px`, maxHeight: `${tHeight}px` }"
        key-field="accountantSubjectId" label-field="accountantSubjectName" children-field="children" block-line
        :data="data" :node-props="nodeProps" :pattern="pattern" :show-irrelevant-nodes="false"
      />
    </n-spin>
    <!-- <div flex justify-around>
      <NButton type="primary" ml-5 @click="addSubject">
        <template #icon>
          <icon-material-symbols-add />
        </template>
        新增
      </NButton>
      <NButton type="info" mr-5 ml-5 @click="editSubject">
        <template #icon>
          <icon-ic:outline-edit-note />
        </template>
        编辑
      </NButton>
      <NButton type="error" @click="deleteSubject">
        <template #icon>
          <icon-icon-park-outline:delete-three />
        </template>
        删除
      </NButton>
    </div> -->
  </n-space>
</template>

<style scoped>

</style>
