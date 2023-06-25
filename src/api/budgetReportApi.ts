import request from '@/utils/http'

export const budgetReportApi = {
  // 获取科目报表
  fetchAccountReport: (params?: object) => {
    return request({
      url: '/statement/budSubjectStatement',
      method: 'get',
      params,
    })
  },
  // 执行汇总表科目详情
  amountSourceOne: (params?: object) => {
    return request({
      url: '/statement/amountSourceOne',
      method: 'get',
      params,
    })
  },

  // 执行汇总表部门详情
  amountSourceTwo: (params?: object) => {
    return request({
      url: '/statement/amountSourceTwo',
      method: 'get',
      params,
    })
  },

  // 预算执行表详情
  amountSourceThree: (params?: object) => {
    return request({
      url: '/statement/amountSourceThree',
      method: 'get',
      params,
    })
  },

  fetchbudSubjectStatementDetail: (params?: object) => {
    return request({
      url: '/statement/budSubjectStatementDetail',
      method: 'get',
      params,
    })
  },

  fetchDeptReport: (params?: object) => {
    return request({
      url: '/statement/deptStatement',
      method: 'get',
      params,
    })
  },
  // 本年预算和往年预算报表-表头
  fetchGetOutsideTitle: (params?: object) => {
    return request({
      url: '/statement/getOutsideTitle',
      method: 'get',
      params,
    })
  },
  // 本年预算和往年预算报表-表体
  fetchNowAndPreviousYears: (params?: object) => {
    return request({
      url: '/statement/nowAndPreviousYears',
      method: 'get',
      params,
    })
  },

  // 本年预算和去年执行报表-表头
  fetchGetLastYearOutsideTitle: (params?: object) => {
    return request({
      url: '/statement/getLastYearOutsideTitle',
      method: 'get',
      params,
    })
  },
  // 本年预算和去年执行报表-表体
  fetchNowAndLastYear: (params?: object) => {
    return request({
      url: '/statement/nowAndLastYear',
      method: 'get',
      params,
    })
  },
  // 数据对比表-表头
  getdataContrastStatementTitle: (params?: object) => {
    return request({
      url: '/statement/getdataContrastStatementTitle',
      method: 'get',
      params,
    })
  },

  dataContrastStatement: (params?: object) => {
    return request({
      url: '/statement/dataContrastStatement',
      method: 'get',
      params,
    })
  },

}
