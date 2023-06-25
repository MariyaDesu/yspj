<script setup lang="ts">
import { dateZhCN, zhCN } from 'naive-ui'
import AppProvider from '@/components/common/AppProvider.vue'
</script>

<template>
  <AppProvider :locale="zhCN" :date-locale="dateZhCN">
    <router-view v-slot="{ Component }">
      <component :is="Component" />
    </router-view>
  </AppProvider>
</template>
