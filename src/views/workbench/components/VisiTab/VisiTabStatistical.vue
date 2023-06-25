<script setup lang="ts">
import type { ECharts, EChartsOption } from 'echarts'
import { init } from 'echarts'
import { workBenchApi } from '@/api/workbench'

let search: any = reactive({})

const expendList: any = reactive({
  budgetList: [],
})

const incomeList: any = reactive({
  budgetList: [],
})
// 初始化数据
function initData() {
  if (!document.getElementById('mainStatisticalList'))
    return
  const charEle = document.getElementById('mainStatisticalList') as HTMLElement
  const charEch: ECharts = init(charEle)

  const option: EChartsOption = {
    grid: [{
      left: '10%',
      height: '75%',
      width: '40%',
    }, {
      left: '60%',
      height: '75%',
      width: '40%',
    }],
    title: [{
      text: '支出构成图',
      left: '20%',
      top: '3%',
      textStyle: {
        fontSize: 18,
        fontWeight: 'normal',
        color: '#465166',
      },
    }, {
      text: '收入构成图',
      left: '70%',
      top: '3%',
      textStyle: {
        fontSize: 18,
        fontWeight: 'normal',
        color: '#465166',
      },
    }],
    tooltip: {
      trigger: 'item',
      formatter: '{b} : {c} ({d}%)',
    },
    // legend: {
    //   orient: 'vertical',
    //   left: 'left',
    // },
    series: [
      {
        type: 'pie',
        radius: '50%',
        center: ['25%', '50%'],
        data: expendList.budgetList,
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)',
          },
        },
      },
      {
        type: 'pie',
        radius: '50%',
        center: ['75%', '50%'],
        data: incomeList.budgetList,
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)',
          },
        },
      },
    ],
  }
  charEch.setOption(option)
}

const instance = getCurrentInstance()
// 收入
async function expend() {
  search.feeType = 2
  // searchList
  const res = await workBenchApi.oneSubjectCartogramList(search)
  expendList.budgetList = []
  res.data.forEach((item: { oneCoName: string; actualAmountSum: number }) => {
    expendList.budgetList.push({ name: item.oneCoName, value: item.actualAmountSum })
  })
}
// 支出
async function income() {
  search.feeType = 1
  // searchList
  const res = await workBenchApi.oneSubjectCartogramList(search)
  incomeList.budgetList = []
  res.data.forEach((item: { oneCoName: string; actualAmountSum: number }) => {
    incomeList.budgetList.push({ name: item.oneCoName, value: item.actualAmountSum })
  })
}
// 初始化收入&支出&图表数据
async function sujectCartogramList(value) {
  search = { ...value }
  await expend()
  await income()
  initData()
}

// 销毁 $bus 事件
instance?.proxy?.$Bus.off('visTabStatisticalList')
onMounted(() => {
  instance?.proxy?.$Bus.on('visTabStatisticalList', (value: any) => {
    sujectCartogramList(value)
  })
})

// echart 销毁
onBeforeUnmount(() => {
  const charEle = document.getElementById('mainStatisticalList') as HTMLElement
  const charEch: ECharts = init(charEle)

  charEch.dispose()
})
</script>

<template>
  <div id="mainStatisticalList" :style="{ height: '300px' }" />
</template>

<style scoped>

</style>
