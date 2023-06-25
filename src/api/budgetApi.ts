import request from '@/utils/http'
// 预算录入
export const budgetEntryApi = {
  // 预算科目列表
  getBudgetEntryList: (params?: object) => {
    return request({
      url: '/budSubject/selectDetail',
      method: 'get',
      params,
    })
  },
  // 预算科目启用列表
  budgetEntryListDisable: (params?: object) => {
    return request({
      url: '/budSubject/disable',
      method: 'get',
      params,
    })
  },
  // 新增预算科目
  saveAddBudgetEntry: (data: object) => {
    return request({
      url: '/budSubject/add',
      method: 'post',
      data,
    })
  },
  // 编辑预算科目
  saveEditBudgetEntry: (data: object) => {
    return request({
      url: '/budSubject/update',
      method: 'put',
      data,
    })
  },
  // 删除预算科目
  removeBudEntry: (data: object) => {
    return request({
      url: '/budSubject/delete',
      method: 'delete',
      data,
    })
  },
  // 导出预算科目
  getOutPutList: (params?: object) => {
    return request({
      url: '/budSubject/outPut',
      method: 'get',
      params,
    })
  },

}
// 预算方案
export const budgetProgramApi = {
  // 预算方案列表
  getBudProList: (params?: object) => {
    return request({
      url: '/budProgrammer/selectList',
      method: 'get',
      params,
    })
  },
  // 新增预算方案
  saveAddBudProgrammer: (data: object) => {
    return request({
      url: '/budProgrammer/add',
      method: 'post',
      data,
    })
  },
  // 编辑预算方案
  saveEditBudProgrammer: (data: object) => {
    return request({
      url: '/budProgrammer/update',
      method: 'put',
      data,
    })
  },
  // 删除预算方案
  removeBudProgrammer: (params?: object) => {
    return request({
      url: '/budProgrammer/delete',
      method: 'delete',
      params,
    })
  },

}
// 预算录入
export const budgetCompileListApi = {
  // 根据id查询预算科目的说明
  getBudCompileSelectId: (params?: object) => {
    return request({
      url: '/budCompile/selectByBudSubjectId',
      method: 'get',
      params,
    })
  },
  // 获取预算录入列表
  getBudCompileList: (params?: object) => {
    return request({
      url: '/budCompile/selectList',
      method: 'get',
      params,
    })
  },
  // 预算录入详情
  getBudCompileDataList: (params?: object) => {
    return request({
      url: '/budCompile/selectDetail',
      method: 'get',
      params,
    })
  },
  // 删除预算录入
  removeBudCompile: (params?: object) => {
    return request({
      url: '/budCompile/delete',
      method: 'delete',
      params,
    })
  },
  // 新增预算录入
  saveAddBudCompileListEdit: (data: object) => {
    return request({
      url: '/budCompile/add',
      method: 'post',
      data,
    })
  },
  // 修改预算录入
  saveEditBudCompileListEdit: (data: object) => {
    return request({
      url: '/budCompile/update',
      method: 'put',
      data,
    })
  },
  // 判断预算编制代码是否有误
  selectIfExist: (params?: object) => {
    return request({
      url: '/budCodeSetting/selectIfExist',
      method: 'get',
      params,
    })
  },
  // 流程详情
  getAutoProcessList: (params?: object) => {
    return request({
      url: '/process/getAuto',
      method: 'get',
      params,
    })
  },
  // 保存流程
  saveProcessDetails: (data: object) => {
    return request({
      url: '/instance/addInstance',
      method: 'POST',
      data,
    })
  },
  // 获取编码
  fetchCode: (params?: object) => {
    return request({
      url: '/budCodeSetting/getDefaultCode',
      method: 'get',
      params,
    })
  },
  // 批量新增
  submitList: (data: object) => {
    return request({
      url: '/budCompile/submitList',
      method: 'POST',
      data,
    })
  },
  // 批量保存
  submitProessList: (data: object) => {
    return request({
      url: '/instance/batchInstanceOperation',
      method: 'POST',
      data,
    })
  },

}
// 预算调整
export const budgetCompileListAlterApi = {
// 获取预算调整列表数据
  getBudCompileAlterList: (params?: object) => {
    return request({
      url: '/budCompile/selectListAndExecute',
      method: 'get',
      params,
    })
  },
  // 预算调整查看详情
  getBudCompileAlterDataList: (params?: object) => {
    return request({
      url: '/budCompile/selectAdjustmentDetail',
      method: 'get',
      params,
    })
  },
  // 预算调整 按钮组保存
  saveAddBudCompileListAlterEdit: (data: object) => {
    return request({
      url: '/budCompile/addAdjustment',
      method: 'post',
      data,
    })
  },
  // 批量提交流程
  submitProessList: (data: object) => {
    return request({
      url: '/instance/batchInstanceOperation',
      method: 'POST',
      data,
    })
  },

  // 批量新增
  submitList: (data: object) => {
    return request({
      url: '/budCompile/submitListTwo',
      method: 'POST',
      data,
    })
  },
  // 获取预算方案
  getselectCurrent: (params?: object) => {
    return request({
      url: '/budCompile/selectCurrentTwo',
      method: 'get',
      params,
    })
  },
  // 预算调整新增
  adjustmentAdd: (data: object) => {
    return request({
      url: '/budCompile/adjustmentAdd',
      method: 'POST',
      data,
    })
  },

}
// 预算审批
export const budgetApprovalListApi = {
// 获取预算审批列表
  getBudApprovalListList: (params?: object) => {
    return request({
      url: '/instanceStep/getListByAdminCreated',
      method: 'get',
      params,
    })
  },
  // 批量审批操作
  batchExecuteOperation: (data: object) => {
    return request({
      url: '/instanceStep/batchExecuteOperation',
      method: 'post',
      data,
    })
  },

}

