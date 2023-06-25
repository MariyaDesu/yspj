<script setup lang="ts">
import executeAccountReport from '../executeAccountReport/index.vue'
import executeDeptReport from '../executeDeptReport/index.vue'
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
  <executeAccountReport v-if="isReport" />
  <executeDeptReport v-else />
</template>

<style scoped>

</style>
