import request from '@/utils/http'
// 工作台api
export const workBenchApi = {
  getAffairs: (params: object) => {
    return request({
      url: '/instanceStep/getListAdmin',
      method: 'get',
      params,
    })
  },

  getListControlByAdmin: (params: object) => {
    return request({
      url: '/instanceStep/getListControlByAdmin',
      method: 'get',
      params,
    })
  },

  passAffairs: (data: object) => {
    return request({
      url: '/instanceStep/executeInstanceStep',
      method: 'post',
      data,
    })
  },

  getProcessSelect: (params: object) => {
    return request({
      url: '/process/getSelect',
      method: 'get',
      params,
    })
  },

  batchRecall: (data: object) => {
    return request({
      url: '/instanceStep/auditEEInstanceNode',
      method: 'post',
      data,
    })
  },
  // 科目排行榜
  sujectCartogramList: (params: object) => {
    return request({
      url: '/cartogram/sujectCartogramList',
      method: 'get',
      params,
    })
  },
  // 数据趋势图/按月
  dateCartogramList: (params: object) => {
    return request({
      url: '/cartogram/dateCartogramList',
      method: 'get',
      params,
    })
  },
  // 一级科目统计占比
  oneSubjectCartogramList: (params: object) => {
    return request({
      url: '/cartogram/oneSubjectCartogramList',
      method: 'get',
      params,
    })
  },
  // 各部门支出排行榜
  deptCartogramList: (params: object) => {
    return request({
      url: '/cartogram/deptCartogramList',
      method: 'get',
      params,
    })
  },

  // 营业收入类别排行榜
  yinYeShouRuCartogramList: (params: object) => {
    return request({
      url: '/cartogram/yinYeShouRuCartogramList',
      method: 'get',
      params,
    })
  },

}
