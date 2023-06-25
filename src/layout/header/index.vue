<script setup lang="ts">
import Notice from './components/Notice.vue'
import TimeDate from './components/TimeDate.vue'
import BreadCrumb from './components/BreadCrumb.vue'
import MenuCollapse from './components/MenuCollapse.vue'
import FullScreen from './components/FullScreen.vue'
import UserAvatar from './components/UserAvatar.vue'
</script>

<template>
  <div flex items-center>
    <MenuCollapse />
    <BreadCrumb ml-15 hidden sm:block />
  </div>
  <div ml-auto flex items-center>
    <TimeDate />
    <Notice />
    <FullScreen />
    <UserAvatar />
  </div>
</template>
