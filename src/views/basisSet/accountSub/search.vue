<script setup lang="ts">
import { baseApi } from '~/src/api/baseApi'
import { showBtn } from '@/utils/common'
const props = defineProps<{
  buttons: string[]
}>()

const loading = ref(false)
const instance = getCurrentInstance()

const exportHandle = () => {
  instance?.proxy?.$Bus.emit('exportsExcel')
}

const searchHandle = () => {
  instance?.proxy?.$Bus.emit('fetchMenuTableData')
}

async function importHandle(ev) {
  try {
    const formdata = new FormData()
    formdata.append('file', ev.file.file)
    loading.value = true

    const res = await baseApi.budAccountantSubjectImports(formdata)
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
const subEnable = () => {
  instance?.proxy?.$Bus.emit('subEnable')
}

onMounted(() => {
  instance?.proxy?.$Bus.on('loading', (val: boolean) => {
    loading.value = val
  })
})
</script>

<template>
  <n-space v-if="props.buttons.length === 0 ? false : true" mb-10>
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
    <NButton v-if="showBtn('导出', props.buttons)" type="info" :loading="loading" @click="exportHandle">
      <template #icon>
        <icon-uil:file-import />
      </template>
      导出
    </NButton>
    <NButton v-if="showBtn('科目启用', props.buttons)" type="warning" @click="subEnable">
      <template #icon>
        <icon-carbon:subnet-acl-rules />
      </template>
      科目启用
    </NButton>
  </n-space>
</template>

<style scoped>

</style>

