<script setup lang="ts">
import { useAppStore, useBaseApiListStore } from '@/store'

const appStore = useAppStore()

const baseApiListStore = useBaseApiListStore()
// 预算科目
async function getbudAccountList() {
  if (JSON.stringify(baseApiListStore.budAccountInfo) === '[]')
    await baseApiListStore.getBudAccountantSubjectList()
}
// 会计科目
async function getAccountList() {
  if (JSON.stringify(baseApiListStore.budAccountInfo) === '[]')
    await baseApiListStore.getAccountSubSubjectList()
}
// 产权结构
async function getAssetOptionsList() {
  if (JSON.stringify(baseApiListStore.assetInfo) === '[]')
    await baseApiListStore.getAssetOptionsList()
}
// 管理结构
async function getBranchOptionsList() {
  if (JSON.stringify(baseApiListStore.branchInfo) === '[]')
    await baseApiListStore.getBranchOptionsList()
}

// 有权限的产权结构
async function getUserAssetSelect() {
  if (JSON.stringify(baseApiListStore.assetUserInfo) === '[]')
    await baseApiListStore.getUserAssetSelect()
}
// 有权限的管理结构
async function getUserBranchSelect() {
  if (JSON.stringify(baseApiListStore.branchUserInfo) === '[]')
    await baseApiListStore.getUserBranchSelect()
}

async function getselectCurrent() {
  if (JSON.stringify(baseApiListStore.budProgrammeInfo) === '[]')
    await baseApiListStore.getselectCurrent()
}

onMounted(() => {
  getbudAccountList()
  getAccountList()
  getAssetOptionsList()
  getBranchOptionsList()
  getUserAssetSelect()
  getUserBranchSelect()
  getselectCurrent()
})
</script>

<template>
  <router-view v-slot="{ Component, route }">
    <transition name="fade-slide" mode="out-in" appear>
      <component :is="Component" v-if="appStore.reloadFlag" :key="route.path" />
    </transition>
  </router-view>
</template>
