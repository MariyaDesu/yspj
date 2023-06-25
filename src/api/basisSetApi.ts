import request from '@/utils/http'
// 管理结构配置API
export const organApi = {
  // 获取管理结构列表
  getOrganList: (params: object) => {
    return request({
      url: '/branch/getList',
      method: 'get',
      params,
    })
  },
  // 保存管理结构
  saveAddOrgan: (data: object) => {
    return request({
      url: '/branch/addBranch',
      method: 'post',
      data,
    })
  },
  // 编辑管理结构
  saveEditOrgan: (data: object) => {
    return request({
      url: '/branch/modifyBranch',
      method: 'put',
      data,
    })
  },
  // 删除管理结构
  removeOrgan: (data: object) => {
    return request({
      url: '/branch/removeBranchByList',
      method: 'delete',
      data,
    })
  },
}

// 部门管理API
export const deptManagementApi = {
  getDeptManagementList: (params: object) => {
    return request({
      url: '/dept/getList',
      method: 'get',
      params,
    })
  },

  // 保存管理结构
  saveAddDept: (data: object) => {
    return request({
      url: '/dept/addDept',
      method: 'post',
      data,
    })
  },

  // 保存编辑管理结构
  saveEditDept: (data: object) => {
    return request({
      url: '/dept/modifyDept',
      method: 'put',
      data,
    })
  },
  // 部门管理删除
  removeDept: (data: object) => {
    return request({
      url: '/dept/removeDeptByList',
      method: 'delete',
      data,
    })
  },

}

// 流程API
export const processApi = {
  getProcessList: (params?: object) => {
    return request({
      url: '/process/getList',
      method: 'get',
      params,
    })
  },

  // 保存流程
  saveProcess: (data: object) => {
    return request({
      url: '/process/addProcess',
      method: 'post',
      data,
    })
  },

  // 保存编辑流程
  saveEditProcess: (data: object) => {
    return request({
      url: '/process/modifyProcess',
      method: 'put',
      data,
    })
  },
  // 删除流程
  removeProcess: (data: object) => {
    return request({
      url: '/process/removeProcessByList',
      method: 'delete',
      data,
    })
  },

}
// 会计科目
export const accountSubApi = {
// 根据id获取会计科目表格消息
  getBudgetEntryList: (params: object) => {
    return request({
      url: '/budAccountantSubject/selectDetail',
      method: 'get',
      params,
    })
  },
  // 科目启用
  budgetEntryListDisable: (params: object) => {
    return request({
      url: '/budAccountantSubject/disable',
      method: 'get',
      params,
    })
  },
  // 新增会计科目
  saveAddBudgetEntry: (data: object) => {
    return request({
      url: '/budAccountantSubject/add',
      method: 'post',
      data,
    })
  },
  // 编辑会计科目
  saveEditBudgetEntry: (data: object) => {
    return request({
      url: '/budAccountantSubject/update',
      method: 'put',
      data,
    })
  },
  // 删除会计科目
  removeBudEntry: (data: object) => {
    return request({
      url: '/budAccountantSubject/delete',
      method: 'delete',
      data,
    })
  },
  // 导出会计科目
  getOutPutList: (params: object) => {
    return request({
      url: '/budAccountantSubject/outPut',
      method: 'get',
      params,
    })
  },

}
// 科目匹配
export const subMatchApi = {
  // 获取科目匹配列表
  getSubMatchList: (params: object) => {
    return request({
      url: '/budSubjectBinding/selectList',
      method: 'get',
      params,
    })
  },
  // 新增科目匹配
  saveAddSubMatch: (data: object) => {
    return request({
      url: '/budSubjectBinding/add',
      method: 'post',
      data,
    })
  },
  // 编辑科目匹配
  saveEditSubMatch: (data: object) => {
    return request({
      url: '/budSubjectBinding/update',
      method: 'put',
      data,
    })
  },
  // 删除科目匹配
  removeSubMatch: (params: object) => {
    return request({
      url: '/budSubjectBinding/delete',
      method: 'delete',
      params,
    })
  },
}
// 编号规则
export const budCodeSettingApi = {
// 编号规则列表
  getbudCodeSettingList: (params: object) => {
    return request({
      url: '/budCodeSetting/selectList',
      method: 'get',
      params,
    })
  },
  // 添加编号规则
  saveAddBudCodeSetting: (data: object) => {
    return request({
      url: '/budCodeSetting/add',
      method: 'post',
      data,
    })
  },
  // 编辑编号规则
  saveEditBudCodeSetting: (data: object) => {
    return request({
      url: '/budCodeSetting/update',
      method: 'put',
      data,
    })
  },
  // 删除编号规则
  removeBudCodeSetting: (params: object) => {
    return request({
      url: '/budCodeSetting/delete',
      method: 'delete',
      params,
    })
  },

}

