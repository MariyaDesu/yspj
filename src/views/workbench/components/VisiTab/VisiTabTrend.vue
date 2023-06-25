<script setup lang="ts">
import type { ECharts, EChartsOption } from 'echarts'
import { init } from 'echarts'
import { workBenchApi } from '@/api/workbench'

let search: any = reactive({})

const expendList: any = reactive({
  title: [],
  budgetList: [],
})

const incomeList: any = reactive({
  title: [],
  budgetList: [],
})

function initData() {
  if (!document.getElementById('mainTrendList'))
    return
  const charEle = document.getElementById('mainTrendList') as HTMLElement
  const charEch: ECharts = init(charEle)

  const option: EChartsOption = {
    grid: [{
      left: '10%',
      height: '75%',
      width: '38%',
    }, {
      left: '60%',
      height: '75%',
      width: '38%',
    }],
    title: [{
      text: '支出趋势',
      left: '23%',
      top: '3%',
      textStyle: {
        fontSize: 18,
        fontWeight: 'normal',
        color: '#465166',
      },
    }, {
      text: '收入趋势',
      left: '76%',
      top: '3%',
      textStyle: {
        fontSize: 18,
        fontWeight: 'normal',
        color: '#465166',
      },
    }],
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow',
      },
    },
    // x轴配置
    xAxis: [{
      gridIndex: 0,
      type: 'category',
      data: incomeList.title,
    },
    {
      gridIndex: 1,
      type: 'category',
      data: expendList.title,
    },
    ],
    // y轴配置
    yAxis: [{
      type: 'value',
      gridIndex: 0,
      data: incomeList.title,
    }, {
      type: 'value',
      gridIndex: 1,
      data: expendList.title,
    },

    ],
    series: [{
      xAxisIndex: 0,
      yAxisIndex: 0,
      type: 'line',
      name: '支付数据',
      data: incomeList.budgetList,
    },
    {
      xAxisIndex: 1,
      yAxisIndex: 1,
      type: 'line',
      name: '收入数据',
      data: expendList.budgetList,
    },
    ],
  }
  charEch.setOption(option)
}

const instance = getCurrentInstance()

async function expend() {
  search.feeType = 2
  // searchList
  const res = await workBenchApi.dateCartogramList(search)
  expendList.title = []
  expendList.budgetList = []

  if (res.data.length !== 0) {
    res.data.forEach((item: { yearMonth: string; actualAmountSum: number }) => {
      expendList.title.push(item.yearMonth)
      expendList.budgetList.push(item.actualAmountSum)
    })
  }
  else {
    expendList.title = ['XXXX-XX', 'XXXX-XX', 'XXXX-XX', 'XXXX-XX', 'XXXX-XX']
    expendList.budgetList = [0, 0, 0, 0, 0]
  }
}

async function income() {
  search.feeType = 1
  // searchList
  const res = await workBenchApi.dateCartogramList(search)
  incomeList.title = []
  incomeList.budgetList = []

  if (res.data.length !== 0) {
    res.data.forEach((item: { yearMonth: string; actualAmountSum: number }) => {
      incomeList.title.push(item.yearMonth)
      incomeList.budgetList.push(item.actualAmountSum)
    })
  }
  else {
    incomeList.title = ['XXXX-XX', 'XXXX-XX', 'XXXX-XX', 'XXXX-XX', 'XXXX-XX']
    incomeList.budgetList = [0, 0, 0, 0, 0]
  }
}
async function sujectCartogramList(value) {
  search = { ...value }
  await expend()
  await income()
  initData()
}
instance?.proxy?.$Bus.off('visTabTrendList')
onMounted(() => {
  instance?.proxy?.$Bus.on('visTabTrendList', (value: any) => {
    sujectCartogramList(value)
  })
})
onBeforeUnmount(() => {
  const charEle = document.getElementById('mainTrendList') as HTMLElement
  const charEch: ECharts = init(charEle)

  charEch.dispose()
})
</script>

<template>
  <div id="mainTrendList" :style="{ height: '300px' }" />
</template>

<style scoped></style>
