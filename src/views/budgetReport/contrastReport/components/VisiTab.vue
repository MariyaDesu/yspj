<script setup lang="ts">
import type { ECharts, EChartsOption } from 'echarts'
import { init } from 'echarts'
const props = defineProps<{
  sheetTitle: string[]
  sheetData: any[]
  beginYear: string
  endYear: string
}>()

const { sheetTitle, sheetData, beginYear, endYear } = toRefs(props)

function inits() {
  const charEle = document.getElementById('main') as HTMLElement
  const charEch: ECharts = init(charEle)
  const option: EChartsOption = {
    title: {
      text: '历年预算对比表',
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow',
      },
    },
    legend: {},
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true,
    },
    xAxis: {
      type: 'value',
      boundaryGap: [0, 0.01],
    },
    yAxis: {
      type: 'category',
      data: sheetTitle.value,
    },

    series: sheetData.value,
    // series: [
    //   {
    //     name: beginYear.value,
    //     type: 'bar',
    //     data: sheetData.value[0],
    //   },
    //   {
    //     name: endYear.value,
    //     type: 'bar',
    //     data: sheetData.value[1],
    //   },
    // ],
  }
  charEch.setOption(option, true)
}
onMounted(() => {
  inits()
})

// function init() {
//   charEch.setOption(option)
// }

watch(props, (newval, oldval) => {
  sheetTitle.value = newval.sheetTitle
  beginYear.value = newval.beginYear
  endYear.value = newval.endYear
  inits()
})
</script>

<template>
  <div id="main" />
</template>

<style scoped>

</style>
