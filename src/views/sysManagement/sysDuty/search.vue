<script setup lang="ts">
// import type { CascaderOption } from 'naive-ui'
// import { baseApi } from '@/api/baseApi'
import { showBtn } from '@/utils/common'
const props = defineProps<{
  buttons: string[]
}>()
interface searchKey {
  keyWord?: string
  dutyCode?: string
  linkmanMobile?: string
  branchId?: string
  deptId?: string | null
  dutyName?: string
}

const search: searchKey = reactive({
})
// const flag = ref(true)
const instance = getCurrentInstance()
const editHandle = () => {
  instance?.proxy?.$Bus.emit('edit')
}

const searchHandle = () => {
  instance?.proxy?.$Bus.emit('search', search)
}

const deleteHandle = () => {
  instance?.proxy?.$Bus.emit('delete')
}

const loading = ref(false)
const exportHandle = () => {
  instance?.proxy?.$Bus.emit('exportsExcel')
}
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
        <n-form-item label="审批角色编码" path="dutyCode" w-200>
          <n-input
            v-model:value="search.dutyCode"
          />
        </n-form-item>
        <n-form-item label="审批角色名称" path="dutyName" w-200>
          <n-input
            v-model:value="search.dutyName"
          />
        </n-form-item>
      </n-form>
    </n-space>
    <n-space v-if="props.buttons.length === 0 ? false : true">
      <NButton v-if="showBtn('导出', props.buttons)" type="info" :loading="loading" @click="exportHandle">
        <template #icon>
          <icon-uil:file-import />
        </template>
        导出
      </NButton>
      <NButton v-if="showBtn('新增', props.buttons)" type="warning" @click="editHandle">
        <template #icon>
          <icon-material-symbols-add />
        </template>
        新增
      </NButton>
      <NButton v-if="showBtn('查找', props.buttons)" type="primary" @click="searchHandle">
        查找 ( F )
      </NButton>
      <NButton v-if="showBtn('新增', props.buttons)" type="error" @click="deleteHandle">
        <template #icon>
          <icon-material-symbols:delete-outline />
        </template>
        批量删除
      </NButton>
    </n-space>
  </n-space>
</template>

<style scoped>

</style>

