<script setup lang="ts">
import { baseApi } from '@/api/baseApi'
import { useBaseApiListStore } from '@/store'

const baseApiListStore: any = useBaseApiListStore()
const timestamp = ref()
function fotMatTime(timestamp) {
  const time = new Date(timestamp)
  const year = time.getFullYear()
  const month = time.getMonth() + 1
  const date = time.getDate()
  return `${year}-${month}-${date}`
}

async function onChange() {
  const startTime = fotMatTime(timestamp.value[0])
  const endTime = fotMatTime(timestamp.value[1])
  if (baseApiListStore.timeInfo.id) {
    const res = await baseApi.setCanUpdateTime({ id: baseApiListStore.timeInfo.id, canupdateTime: startTime, canupdateTimeEnd: endTime })
    if (res.code === 200) {
      baseApiListStore.selectCanUpdateTime()
      window.$message?.success(`${res.data}`)
    }
    else {
      window.$message?.error(`${res.message}`)
    }
  }
  else {
    const res = await baseApi.setCanUpdateTime({ canupdateTime: startTime, canupdateTimeEnd: endTime })
    if (res.code === 200)
      window.$message?.success(`${res.data}`)

    else
      window.$message?.error(`${res.message}`)
  }
}

async function selectCanUpdateTime() {
  await baseApiListStore.selectCanUpdateTime()
}
onMounted(() => {
  selectCanUpdateTime()
})
</script>

<template>
  <n-popover trigger="hover">
    <template #trigger>
      <n-button size="large" text strong pl-15>
        <template #icon>
          <icon-ic:round-event-note />
        </template>
      </n-button>
    </template>
    <template #header>
      <n-date-picker
        v-model:value="timestamp"
        type="daterange"
        clearable
        panel
        format="yyyy/MM/dd"
        @confirm="onChange"
      />
    </template>
    <template #footer>
      <n-layout>
        <n-layout>预算调整设置的开始日期：{{ baseApiListStore.timeInfo.canupdateTime }}</n-layout>
        <n-layout>预算调整设置的结束日期：{{ baseApiListStore.timeInfo.canupdateTimeEnd }}</n-layout>
      </n-layout>
    </template>
  </n-popover>
</template>

<style scoped>

</style>
