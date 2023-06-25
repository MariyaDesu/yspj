<script setup lang="ts">
interface budgetFrom {
  name: string
  time: string
  annual: string
}

const options = [
  {
    label: '2019',
    value: '2019',
  },
  {
    label: '2020',
    value: '2020',
  },
  {
    label: '2021',
    value: '2021',
  },
  {
    label: '2022',
    value: '2022',
  },
]

const budget: budgetFrom = reactive({
  name: '',
  time: '',
  annual: '',
})
</script>

<template>
  <n-space flex-1 min-w-380>
    <n-form-item label="方案名称">
      <n-input v-model:value="budget.name" />
    </n-form-item>
    <n-form-item label="预算年度" ml-10 mr-10>
      <n-space vertical w-80>
        <n-select v-model:value="budget.annual" :options="options" placeholder="请输入" />
      </n-space>
    </n-form-item>
  </n-space>
  <n-space m-auto min-w-80>
    <NButton type="success">
      查找 ( F )
    </NButton>
  </n-space>
</template>

<style scoped>

</style>

