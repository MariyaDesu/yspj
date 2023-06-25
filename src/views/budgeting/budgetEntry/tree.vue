<script setup lang="ts">
import type { TreeOption } from 'naive-ui'
import { NButton } from 'naive-ui'
// import { baseApi } from '@/api/baseApi'
import { showBtn } from '@/utils/common'
import { useAppStore, useBaseApiListStore } from '@/store'
const props = defineProps<{
  buttons: string[]
}>()
const appStore = useAppStore()
const baseApiListStore = useBaseApiListStore()

const loading = ref(false)
const tHeight = ref(appStore.tHeight - 220)
// 树形数据
/**
 * data 树形数据
 * pattern 搜索keyValue
 * nodeProps 节点事件
 */
const data = ref()
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

const instance = getCurrentInstance()
// 新增菜单
function addSubject() {
  instance?.proxy?.$Bus.emit('edit', { })
}
// 根据左边点击的id 获取右边表格的数据
function getBudgetEntryList(option: TreeOption) {
  instance?.proxy?.$Bus.emit('fetchBudEntryTableData', option.id)
}
watch(() => baseApiListStore.budAccountInfo, (newval, oldval) => {
  data.value = baseApiListStore.budAccountInfo
})

// 获取预算科目
async function initTableData() {
  loading.value = true
  try {
    await baseApiListStore.getBudAccountantSubjectList().then((res) => {
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
// 预算科目添加后缀
// function renderSuffix({ option }: { option: TreeOption }) {
//   return h(
//     NButton,
//     {
//       text: true,
//     },
//     { default: () => option.name },
//   )
// }

onMounted(() => {
  data.value = baseApiListStore.budAccountInfo
  keyVal.value = ''
})
instance?.proxy?.$Bus.on('fetchMenuTableData', () => {
  initTableData()
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
        :style="{ minHeight: `${tHeight}px`, maxHeight: `${tHeight}px` }" key-field="budSubjectId" label-field="budSubjectName" children-field="children" block-line
        :data="data" :node-props="nodeProps" :pattern="pattern" :show-irrelevant-nodes="false"
      />
    </n-spin>
  </n-space>
</template>

<style scoped>

</style>
