<script setup lang="ts">
import { useFullscreen } from '@vueuse/core'

const { isFullscreen, toggle } = useFullscreen()
</script>

<template>
  <n-icon ml-20 mr-20 cursor-pointer size="18" @click="toggle">
    <icon-ant-design:fullscreen-exit-outlined v-if="isFullscreen" />
    <icon-ant-design:fullscreen-outlined v-else />
  </n-icon>
</template>
