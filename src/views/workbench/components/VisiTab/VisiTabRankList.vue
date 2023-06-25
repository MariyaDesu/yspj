<script setup lang="ts">
import type { ECharts, EChartsOption } from 'echarts'
import { init } from 'echarts'
import { workBenchApi } from '@/api/workbench'

let search: any = reactive({})

const expendList: any = reactive({
  title: [],
  budgetList: [],
  actualList: [],
})

const incomeList: any = reactive({
  title: [],
  budgetList: [],
  actualList: [],
})

function initData() {
  if (!document.getElementById('mainRankList'))
    return

  const charEle = document.getElementById('mainRankList') as HTMLElement

  const charEch: ECharts = init(charEle)

  const option: EChartsOption = {
    // 三个图表位置配置
    grid: [{
      left: '15%',
      height: '75%',
      width: '35%',
    }, {
      left: '60%',
      height: '75%',
      width: '35%',
    }],
    title: [{
      text: '支出科目排行榜',
      left: '20%',
      top: '3%',
      textStyle: {
        fontSize: 18,
        fontWeight: 'normal',
        color: '#465166',
      },
    }, {
      text: '收入科目排行榜',
      left: '73%',
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
      type: 'value',
      axisLabel: {
        formatter(value, index) {
          return value >= 10000 ? `${value / 10000}万` : value
        },
      },

    },
    {
      gridIndex: 1,
      type: 'value',
      axisLabel: {
        formatter(value, index) {
          return value >= 10000 ? `${value / 10000}万` : value
        },
      },

    },
    ],
    // y轴配置
    yAxis: [{
      type: 'category',
      axisTick: {
        alignWithLabel: true,
      },
      data: incomeList.title,
      axisPointer: {
        type: 'shadow',
      },
    }, {
      type: 'category',
      gridIndex: 1, // 对应前面grid的索引位置（第2个）
      axisTick: {
        alignWithLabel: true,
      },
      data: expendList.title,
      axisPointer: {
        type: 'shadow',
      },
    },

    ],
    series: [{
      xAxisIndex: 0,
      yAxisIndex: 0,
      type: 'bar',
      barWidth: '25px',
      name: '预算数据',
      data: incomeList.budgetList,
    },
    {
      xAxisIndex: 0,
      yAxisIndex: 0,
      type: 'bar',
      barWidth: '25px',
      name: '实际发生的数据',
      data: incomeList.actualList,
    },
    {
      xAxisIndex: 1,
      yAxisIndex: 1,
      type: 'bar',
      barWidth: '25px',
      name: '预算数据',
      data: expendList.budgetList,
    },
    {
      xAxisIndex: 1,
      yAxisIndex: 1,
      type: 'bar',
      barWidth: '25px',
      name: '实际发生的数据',
      data: expendList.actualList,
    },

    ],
  }
  charEch.setOption(option)
}

const instance = getCurrentInstance()

async function expend() {
  search.feeType = 2
  // searchList
  const res = await workBenchApi.sujectCartogramList(search)
  expendList.title = []
  expendList.budgetList = []
  expendList.actualList = []

  if (res.data.length !== 0) {
    res.data?.forEach((item: { codeAndName: string; subjectAmountSum: number; actualAmountSum: number }) => {
      expendList.title.push(item.codeAndName)
      expendList.budgetList.push(item.subjectAmountSum)
      expendList.actualList.push(item.actualAmountSum)
    })
  }
  else {
    expendList.title = ['科目1', '科目2', '科目3', '科目4', '科目5']
    expendList.budgetList = [0, 0, 0, 0, 0]
    expendList.actualList = [0, 0, 0, 0, 0]
  }
}

async function income() {
  search.feeType = 1
  // searchList
  const res = await workBenchApi.sujectCartogramList(search)
  incomeList.title = []
  incomeList.budgetList = []
  incomeList.actualList = []

  if (res.data.length !== 0) {
    res.data?.forEach((item: { codeAndName: string; subjectAmountSum: number; actualAmountSum: number }) => {
      incomeList.title.push(item.codeAndName)
      incomeList.budgetList.push(item.subjectAmountSum)
      incomeList.actualList.push(item.actualAmountSum)
    })
  }
  else {
    incomeList.title = ['科目1', '科目2', '科目3', '科目4', '科目5']
    incomeList.budgetList = [0, 0, 0, 0, 0]
    incomeList.actualList = [0, 0, 0, 0, 0]
  }
}
async function sujectCartogramList(value) {
  search = { ...value }
  await expend()
  await income()
  initData()
}
instance?.proxy?.$Bus.off('visTabRankList')
onMounted(() => {
  instance?.proxy?.$Bus.on('visTabRankList', (value: any) => {
    sujectCartogramList(value)
  })
})

onBeforeUnmount(() => {
  const charEle = document.getElementById('mainRankList') as HTMLElement
  const charEch: ECharts = init(charEle)

  charEch.dispose()
})
</script>

<template>
  <div id="mainRankList" :style="{ height: '300px' }" />
</template>

<style scoped></style>
