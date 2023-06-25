<script setup lang="ts">
import type { ECharts, EChartsOption } from 'echarts'
import { init } from 'echarts'
import { workBenchApi } from '@/api/workbench'

let search: any = reactive({})

const expendList: any = reactive({
  title: [],
  actualList: [],
})

const incomeList: any = reactive({
  title: [],
  actualList: [],
})

function initData() {
  if (!document.getElementById('mainTwoRankList'))
    return
  const charEle = document.getElementById('mainTwoRankList') as HTMLElement
  const charEch: ECharts = init(charEle)

  const option: EChartsOption = {
    // 三个图表位置配置
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
      text: '各部门支出排行榜',
      left: '18%',
      top: '3%',
      textStyle: {
        fontSize: 18,
        fontWeight: 'normal',
        color: '#465166',
      },
    }, {
      text: '营业收入类别排行榜',
      left: '71%',
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
    series: [
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
  const res = await workBenchApi.yinYeShouRuCartogramList(search)
  expendList.title = []
  expendList.actualList = []

  if (res.data.length !== 0) {
    res.data.forEach((item: { matter: string; actualAmountSum: number }) => {
      expendList.title.push(item.matter)
      expendList.actualList.push(item.actualAmountSum)
    })
  }
  else {
    expendList.title = ['XXXX-XX', 'XXXX-XX', 'XXXX-XX', 'XXXX-XX', 'XXXX-XX']
    expendList.actualList = [0, 0, 0, 0, 0]
  }
}

async function income() {
  search.feeType = 1
  // searchList
  const res = await workBenchApi.deptCartogramList(search)
  incomeList.title = []
  incomeList.actualList = []

  if (res.data.length !== 0) {
    res.data.forEach((item: { deptName: string; actualAmountSum: number }) => {
      incomeList.title.push(item.deptName)
      incomeList.actualList.push(item.actualAmountSum)
    })
  }
  else {
    incomeList.title = ['XX部', 'XX部', 'XX部', 'XX部', 'XX部']
    incomeList.actualList = [0, 0, 0, 0, 0]
  }
}
async function sujectCartogramList(value) {
  search = { ...value }
  await expend()
  await income()
  initData()
}
instance?.proxy?.$Bus.off('visTabTwoRankList')

onMounted(() => {
  instance?.proxy?.$Bus.on('visTabTwoRankList', (value: any) => {
    sujectCartogramList(value)
  })
})
onBeforeUnmount(() => {
  const charEle = document.getElementById('mainTwoRankList') as HTMLElement
  const charEch: ECharts = init(charEle)

  charEch.dispose()
})
</script>

<template>
  <div id="mainTwoRankList" :style="{ height: '300px' }" />
</template>

<style scoped></style>
