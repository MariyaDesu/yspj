<script setup lang="ts">
import { baseApi } from '@/api/baseApi'
import { showBtn } from '@/utils/common'
const props = defineProps<{
  buttons: string[]
}>()
interface searchKey {
  keyWord?: string
  linkmanMobile?: string
  branchId?: string
  deptId?: string | null
  dutyName?: string
}

const search: searchKey = reactive({
})
// const flag = ref(true)
const instance = getCurrentInstance()

const searchHandle = () => {
  instance?.proxy?.$Bus.emit('search', search)
}

const loading = ref(false)

const getcheckedRowKeys: any = ref([])

const checkedRowKeys = () => {
  instance?.proxy?.$Bus.emit('checkedRowKeysHandle')
}

instance?.proxy?.$Bus.on('sendCheckedRowKeysHandle', (value: any) => {
  getcheckedRowKeys.value = value
})
async function importHandle(ev) {
  try {
    const formdata = new FormData()
    formdata.append('file', ev.file.file)
    formdata.append('values', getcheckedRowKeys.value)
    loading.value = true
    const res = await baseApi.importFile(formdata)
    if (res.code === 200) {
      window.$message?.success('导入成功')
      // searchHandle()
      loading.value = false
    }
    else {
      window.$message?.error(`${res.message}`)
      loading.value = false
    }
  }
  catch (error) {
    console.error(error)
    loading.value = false
    searchHandle()
  }
}

function handleBeforeUpload(e: { stopPropagation: () => void }) {
  checkedRowKeys()
  if (getcheckedRowKeys.value.length === 0) {
    window.$message?.error('请选择基础资料')
    e.stopPropagation()
  }
}

function download() {
  const a = document.createElement('a')
  const evt = document.createEvent('MouseEvents')
  a.download = '系统管理初始化资料'
  a.href = '/document/系统管理初始化资料.xlsx'
  evt.initEvent('click', true, true)
  a.dispatchEvent(evt)
  window.URL.revokeObjectURL(a.href)
}
onMounted(() => {
  instance?.proxy?.$Bus.on('loading', (val: boolean) => {
    loading.value = val
  })
})
</script>

<template>
  <n-space flex-1 min-w-380>
    <n-form-item label="基础资料名称" path="dutyName" w-200>
      <n-input
        v-model:value="search.dutyName"
      />
    </n-form-item>
  </n-space>
  <n-space m-auto>
    <NButton type="warning" :loading="loading" @click="download">
      <template #icon>
        <icon-uil:file-import />
      </template>
      基础资料录入模板导出
    </NButton>
    <n-upload
      :show-file-list="false" @change="importHandle"
    >
      <NButton v-if="showBtn('导入', props.buttons)" type="info" :loading="loading" @click="handleBeforeUpload">
        <template #icon>
          <icon-mingcute:file-import-line />
        </template>
        导入
      </NButton>
    </n-upload>

    <!-- <NButton v-if="showBtn('导出', currentRouteMetaList.currentRouteMeta.buttons)" type="info" :loading="loading" @click="exportHandle">
      <template #icon>
        <icon-uil:file-import />
      </template>
      导出
    </NButton> -->
    <!-- <NButton type="warning" @click="editHandle">
      <template #icon>
        <icon-material-symbols-add />
      </template>
      新增
    </NButton>
    <NButton v-if="showBtn('查找', currentRouteMetaList.currentRouteMeta.buttons)" type="primary" @click="searchHandle">
      查找 ( F )
    </NButton> -->
  </n-space>
</template>

<style scoped>

</style>

