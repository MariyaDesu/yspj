<script setup lang="ts">
import type { CascaderOption } from 'naive-ui'
import { baseApi } from '@/api/baseApi'
import { showBtn } from '@/utils/common'
import { useBaseApiListStore } from '@/store'
const props = defineProps<{
  buttons: string[]
}>()
const baseApiListStore = useBaseApiListStore()

interface searchKey {
  budSubjectId?: number
  budAccountantSubjectId?: number
}
interface IOption {
  budSubMenuOptions: CascaderOption[] // 预算科目
  accSubMenuOptions: CascaderOption[] // 会计科目
  // isAssistOptions: SelectOption[]
}
const options: IOption = reactive({
  budSubMenuOptions: [],
  accSubMenuOptions: [],
  // isAssistOptions: [
  //   {
  //     ifAuxiliary: '是',
  //     ifAuxiliaryName: '是',
  //   }, {
  //     ifAuxiliary: '否',
  //     ifAuxiliaryName: '否',
  //   },
  // ],
})
const search: searchKey = reactive({
})

const instance = getCurrentInstance()
const editHandle = () => {
  instance?.proxy?.$Bus.emit('edit')
}

const searchHandle = () => {
  instance?.proxy?.$Bus.emit('search', search)
}

const loading = ref(false)
const exportHandle = () => {
  instance?.proxy?.$Bus.emit('exportsExcel')
}
async function importHandle(ev) {
  try {
    const formdata = new FormData()
    formdata.append('file', ev.file.file)
    loading.value = true
    const res = await baseApi.budSubjectBindingImports(formdata)
    if (res.code === 200)
      window.$message?.success('导入成功')
    else
      window.$message?.error(`${res.message}`)
    searchHandle()
    loading.value = false
  }
  catch (error) {
    console.error(error)
    loading.value = false
    searchHandle()
  }
}
// 模板导出
function download() {
  const a = document.createElement('a')
  const evt = document.createEvent('MouseEvents')
  a.download = '科目匹配导入模板'
  a.href = '/document/科目匹配导入模板.xlsx'
  evt.initEvent('click', true, true)
  a.dispatchEvent(evt)
  window.URL.revokeObjectURL(a.href)
}

onMounted(() => {
  instance?.proxy?.$Bus.on('loading', (val: boolean) => {
    loading.value = val
  })
  options.budSubMenuOptions = baseApiListStore.budAccountInfo
  options.accSubMenuOptions = baseApiListStore.accountSubInfo
})
</script>

<template>
  <n-space vertical>
    <n-space>
      <n-form inline :label-width="80" size="small" :show-feedback="false">
        <n-form-item label="预算科目名称" path="budSubjectId" w-200>
          <NCascader
            v-model:value="search.budSubjectId" label-field="budSubjectName" value-field="budSubjectId"
            :show-path="false" check-strategy="child" children-field="children" filterable
            :options="options.budSubMenuOptions" clearable
          />
        </n-form-item>
        <n-form-item label="会计科目名称" path="budAccountantSubjectId" w-200>
          <NCascader
            v-model:value="search.budAccountantSubjectId" label-field="accountantSubjectName"
            value-field="accountantSubjectId" check-strategy="child" :show-path="false" children-field="children"
            filterable :options="options.accSubMenuOptions" clearable
          />
        </n-form-item>
      </n-form>
    </n-space>
    <n-space v-if="props.buttons.length === 0 ? false : true">
      <NButton v-if="showBtn('模板导出', props.buttons)" type="warning" :loading="loading" @click="download">
        <template #icon>
          <icon-uil:file-import />
        </template>
        模板导出
      </NButton>
      <NButton v-if="showBtn('导出', props.buttons)" type="info" :loading="loading" @click="exportHandle">
        <template #icon>
          <icon-uil:file-import />
        </template>
        导出
      </NButton>
      <n-upload
        :show-file-list="false" @change="importHandle"
      >
        <NButton v-if="showBtn('导入', props.buttons)" type="info" :loading="loading">
          <template #icon>
            <icon-mingcute:file-import-line />
          </template>
          导入
        </NButton>
      </n-upload>
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

<style scoped></style>

