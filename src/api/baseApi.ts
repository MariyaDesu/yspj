import request from '@/utils/http'

export const baseApi = {
  // 获取银行分支列表
  fetchBranchType: (params?: object) => {
    return request({
      url: '/dictionary/getDictionaryDetailByKeyWord',
      method: 'get',
      params,
    })
  },
  // 获取银行列表
  fetchBankType: (params?: object) => {
    return request({
      url: '/dictionary/getDictionaryDetailByKeyWord',
      method: 'get',
      params,
    })
  },

  fetchBankBusType: (params?: object) => {
    return request({
      url: '/dictionary/getDictionaryDetailByKeyWord',
      method: 'get',
      params,
    })
  },
  // 获取管理结构级联下拉
  fetchBranch: (params?: object) => {
    return request({
      url: '/branch/getSelect',
      method: 'get',
      params,
    })
  },

  // 获取管理结构平行下拉
  getBranchAllList: (params?: object) => {
    return request({
      url: '/branch/getSelectAll',
      method: 'get',
      params,
    })
  },
  // 获取管理结构权限平行下拉
  getUserBranchSelect: (params?: object) => {
    return request({
      url: '/branch/getUserBranchSelect',
      method: 'get',
      params,
    })
  },
  // 获取部门下拉
  fetchDept: (params?: object) => {
    return request({
      url: '/dept/getSelect',
      method: 'get',
      params,
    })
  },
  // 预算录入查询部门信息（用户，产权）
  getSelectAssetUser: (params?: object) => {
    return request({
      url: '/dept/getSelectAssetUser',
      method: 'get',
      params,
    })
  },
  //   获取角色下拉
  fetchRole: (params?: object) => {
    return request({
      url: '/role/getSelect',
      method: 'get',
      params,
    })
  },
  //   获取区域下拉
  fetchAreaList: (params?: object) => {
    return request({
      url: '/area/listWithChildren',
      method: 'get',
      params,
    })
  },
  //  获取父级下拉
  fetchMenu: (params?: object) => {
    return request({
      url: '/menu/getSelect',
      method: 'get',
      params,
    })
  },
  //  获取菜单类型
  fetchMenuType: (params?: object) => {
    return request({
      url: '/dictionary/getDictionaryDetailByKeyWord',
      method: 'get',
      params,
    })
  },
  // 获取产权类型
  fetchAssetType: (params?: object) => {
    return request({
      url: '/dictionary/getDictionaryDetailByKeyWord',
      method: 'get',
      params,
    })
  },

  fetchOrganizationType: (params?: object) => {
    return request({
      url: '/dictionary/getDictionaryDetailByKeyWord',
      method: 'get',
      params,
    })
  },
  // 预算列表
  getBudgetEntryMenuList: (params?: object) => {
    return request({
      url: '/budSubject/selectList',
      method: 'get',
      params,
    })
  },
  // 获取用户下拉
  getUserList: (params?: object) => {
    return request({
      url: '/user/getSelect',
      method: 'get',
      params,
    })
  },
  // 获取职位下拉
  fetchDuty: (params?: object) => {
    return request({
      url: '/duty/getSelect',
      method: 'get',
      params,
    })
  },
  // 流程获取用户下拉
  fetchProcessUserList: (params?: object) => {
    return request({
      url: '/user/getSelectList',
      method: 'get',
      params,
    })
  },
  // 用户管理获取职位下拉
  fetchDutyList: (params?: object) => {
    return request({
      url: '/duty/getSelectList',
      method: 'get',
      params,
    })
  },

  getBudProList: (params?: object) => {
    return request({
      url: '/budCompile/selectDefaultBudCompileData',
      method: 'get',
      params,
    })
  },

  selectDefaultBudCompileDataInTwoParts: (params?: object) => {
    return request({
      url: '/budCompile/selectDefaultBudCompileDataInTwoParts',
      method: 'get',
      params,
    })
  },

  // 获取单据下拉
  getBillTypeList: (params?: object) => {
    return request({
      url: '/billType/getSelect',
      method: 'get',
      params,
    })
  },

  // 获取流程下拉
  getProcessList: (params?: object) => {
    return request({
      url: '/process/getSelect',
      method: 'get',
      params,
    })
  },
  // 获取产权级联下拉
  getAssetList: (params?: object) => {
    return request({
      url: '/asset/getSelect',
      method: 'get',
      params,
    })
  },
  // 获取产权平级下拉
  getAssetAllList: (params?: object) => {
    return request({
      url: '/asset/getSelectAll',
      method: 'get',
      params,
    })
  },
  // 获取产权权限平级下拉
  getUserAssetSelect: (params?: object) => {
    return request({
      url: '/asset/getUserAssetSelect',
      method: 'get',
      params,
    })
  },

  // 预算列表
  getBudAccountantSubjectList: (params?: object) => {
    return request({
      url: '/budAccountantSubject/selectList',
      method: 'get',
      params,
    })
  },

  getBudAllAccountantSubjectList: (params?: object) => {
    return request({
      url: '/budAccountantSubject/selectAllList',
      method: 'get',
      params,
    })
  },
  // 预算方案
  getselectCurrent: (params?: object) => {
    return request({
      url: '/budCompile/selectCurrent',
      method: 'get',
      params,
    })
  },

  importFile: (data: object) => {
    return request({
      url: '/excel/import',
      method: 'post',
      data,
    })
  },
  // 预算编制导入
  budCompileImports: (data: object) => {
    return request({
      url: '/budCompile/imports',
      method: 'post',
      data,
    })
  },

  // 预算科目导入
  budSubjectImports: (data: object) => {
    return request({
      url: '/budSubject/imports',
      method: 'post',
      data,
    })
  },

  // 会计科目导入
  budAccountantSubjectImports: (data: object) => {
    return request({
      url: '/budAccountantSubject/imports',
      method: 'post',
      data,
    })
  },

  // 会计匹配导入
  budSubjectBindingImports: (data: object) => {
    return request({
      url: '/budSubjectBinding/imports',
      method: 'post',
      data,
    })
  },
  // 支付登记导入
  budControlPayImports: (data: object) => {
    return request({
      url: '/budControlPay/imports',
      method: 'post',
      data,
    })
  },

  // 预算录入附件上传
  budAttachmentUpload: (data: object) => {
    return request({
      url: '/budCompile/attachmentUpload',
      method: 'post',
      data,
    })
  },

  // 预算录入附件删除
  budAttachmentDelete: (data: object) => {
    return request({
      url: '/budCompile/attachmentDelete',
      method: 'delete',
      data,
    })
  },

  // 预算录入附件下载
  budAttachmentSelect: (params: object) => {
    return request({
      url: '/budCompile/attachmentSelect',
      method: 'get',
      params,
      responseType: 'blob',

    })
  },
  // 获取消息
  instanceMessageGetList: (params: object) => {
    return request({
      url: '/instanceMessage/getList',
      method: 'get',
      params,
    })
  },
  // 确认已读消息
  instanceMessageReadMessage: (data: object) => {
    return request({
      url: '/instanceMessage/readMessage',
      method: 'post',
      data,
    })
  },
  // 获取未读消息数量
  instanceGetMessageCount: (params: object) => {
    return request({
      url: '/instanceMessage/getMessageCount',
      method: 'get',
      params,
    })
  },
  // 预算调整-设置可以编辑的时间（设值之后）-新增编辑同一接口
  setCanUpdateTime: (data: object) => {
    return request({
      url: '/budCompile/setCanUpdateTime',
      method: 'post',
      data,
    })
  },

  selectCanUpdateTime: () => {
    return request({
      url: '/budCompile/selectCanUpdateTime',
      method: 'get',
    })
  },

  // 获取支付方式
  getDictionaryDetailByKeyWord: (params?: object) => {
    return request({
      url: '/dictionary/getDictionaryDetailByKeyWord',
      method: 'get',
      params,
    })
  },
  // 预算控制批量保存
  budControlPaySubmitList: (data: object) => {
    return request({
      url: '/budControlPay/submitList',
      method: 'post',
      data,
    })
  },
}
