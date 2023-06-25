<script setup lang="ts">
import accountReport from '../accountReport/index.vue'
import deptReport from '../deptReport/index.vue'
const instance = getCurrentInstance()
const isReport = ref(true)
instance?.proxy?.$Bus.on('changeReport', (val: number) => {
  isReport.value = !val
})

onUnmounted(() => {
  instance?.proxy?.$Bus.all.clear()
})
</script>

<template>
  <accountReport v-if="isReport" />
  <deptReport v-else />
</template>

<style scoped>

</style>
