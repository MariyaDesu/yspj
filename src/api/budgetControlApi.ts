import request from '@/utils/http'
// 支付登记Api
export const payRegApi = {
  getPayRegList: (params: object) => {
    return request({
      url: '/budControlPay/selectList',
      method: 'get',
      params,
    })
  },

  selectBudCompile: (params: object) => {
    return request({
      url: '/budControlPay/selectBudCompile',
      method: 'get',
      params,
    })
  },

  selectBudCompileBelowSubject: (params: object) => {
    return request({
      url: '/budControlPay/selectBudCompileBelowSubject',
      method: 'get',
      params,
    })
  },

  selectBudSubjectNameCodeList: (params: object) => {
    return request({
      url: '/budControlPay/selectBudSubjectNameCodeList',
      method: 'get',
      params,
    })
  },

  // 保存
  saveAddbudControlPay: (data: object) => {
    return request({
      url: '/budControlPay/add',
      method: 'post',
      data,
    })
  },

  // 保存编辑
  saveEditbudControlPay: (data: object) => {
    return request({
      url: '/budControlPay/update',
      method: 'put',
      data,
    })
  },
  // 删除
  deleteBudControlPay: (params: object) => {
    return request({
      url: '/budControlPay/delete',
      method: 'delete',
      params,
    })
  },

  getRoleMenuList: (params: object) => {
    return request({
      url: '/roleMenu/getListByRoleId',
      method: 'get',
      params,
    })
  },

  addRoleMenu: (data: object) => {
    return request({
      url: '/roleMenu/addRoleMenu',
      method: 'post',
      data,
    })
  },

  // fetchCode: (params: object) => {
  //   return request({
  //     url: '/budControlPay/getDefaultCode',
  //     method: 'get',
  //     params,
  //   })
  // },

  fetchCode: (params: object) => {
    return request({
      url: '/budCodeSetting/getDefaultCode',
      method: 'get',
      params,
    })
  },

  // selectIfExist: (params: object) => {
  //   return request({
  //     url: '/budControlPay/selectIfExist',
  //     method: 'get',
  //     params,
  //   })
  // },

  selectIfExist: (params: object) => {
    return request({
      url: '/budCodeSetting/selectIfExist',
      method: 'get',
      params,
    })
  },

  selectListByBankType: (params: object) => {
    return request({
      url: '/budPay/selectListByBankType',
      method: 'get',
      params,
    })
  },

  selectListByBankAccountNumber: (params: object) => {
    return request({
      url: '/budPay/selectListByBankAccountNumber',
      method: 'get',
      params,
    })
  },

}

// 登记调整
export const adjustApi = {
  // 调整登记-保存或撤回 state 1,0
  BudControlPayUpdateState: (params?: object) => {
    return request({
      url: '/budControlPay/BudControlPayUpdateState',
      method: 'put',
      params,
    })
  },
  getListControlByAdminCreated: (params?: object) => {
    return request({
      url: '/instanceStep/getListControlByAdminCreated',
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

  reloadSubInstance: (data: object) => {
    return request({
      url: '/instanceStep/reloadSubInstance',
      method: 'post',
      data,
    })
  },

}

// 预算审批
export const approvalApi = {

  getListControlByAdmin: (params?: object) => {
    return request({
      url: '/instanceStep/getListControlByAdmin',
      method: 'get',
      params,
    })
  },
  getListControlByAdminCreated: (params?: object) => {
    return request({
      url: '/instanceStep/getListControlByAdminCreated',
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

  reloadSubInstance: (data: object) => {
    return request({
      url: '/instanceStep/reloadSubInstance',
      method: 'post',
      data,
    })
  },

}
