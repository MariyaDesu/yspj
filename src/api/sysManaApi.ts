import request from '@/utils/http'
// 角色管理API
export const sysRoleApi = {
  getSysRoleList: (params: object) => {
    return request({
      url: '/role/getList',
      method: 'get',
      params,
    })
  },
  // 保存角色
  saveAddRole: (data: object) => {
    return request({
      url: '/role/addRole',
      method: 'post',
      data,
    })
  },

  // 保存编辑角色
  saveEditRole: (data: object) => {
    return request({
      url: '/role/modifyRole',
      method: 'put',
      data,
    })
  },
  // 删除角色
  removeRole: (data: object) => {
    return request({
      url: '/role/removeRoleByList',
      method: 'delete',
      data,
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

  addRoleMenuButton: (data: object) => {
    return request({
      url: '/menuButton/addRoleMenuButton',
      method: 'post',
      data,
    })
  },

  getMenuButton: (params: object) => {
    return request({
      url: '/button/getMenuButton',
      method: 'get',
      params,
    })
  },

}

// 用户管理API
export const sysUserApi = {
  getSysUserList: (params: object) => {
    return request({
      url: '/user/getList',
      method: 'get',
      params,
    })
  },

  // 保存用户
  saveAddUser: (data: object) => {
    return request({
      url: '/user/addUser',
      method: 'post',
      data,
    })
  },

  // 保存编辑用户
  saveEditUser: (data: object) => {
    return request({
      url: '/user/modifyUser',
      method: 'put',
      data,
    })
  },
  // 删除用户
  removeUser: (data: object) => {
    return request({
      url: '/user/removeUserByList',
      method: 'delete',
      data,
    })
  },
  // 分配角色列表
  getUserRoleList: (params: object) => {
    return request({
      url: '/userRole/getListByUserId',
      method: 'get',
      params,
    })
  },
  // 保存分配角色
  addUserRole: (data: object) => {
    return request({
      url: '/userRole/addUserRole',
      method: 'post',
      data,
    })
  },

}

// 菜单管理API

export const sysMenuApi = {
  getSysMenuList: (params: object) => {
    return request({
      url: '/menu/getList',
      method: 'get',
      params,
    })
  },

  getSysMenuAllList: (params: object) => {
    return request({
      url: '/menu/getListAll',
      method: 'get',
      params,
    })
  },

  // 保存菜单
  saveAddMenu: (data: object) => {
    return request({
      url: '/menu/addMenu',
      method: 'post',
      data,
    })
  },

  // 保存编辑菜单
  saveEditMenu: (data: object) => {
    return request({
      url: '/menu/modifyMenu',
      method: 'put',
      data,
    })
  },
  // 删除用户
  removeMenu: (data: object) => {
    return request({
      url: '/menu/removeMenuByList',
      method: 'delete',
      data,
    })
  },

  // 保存按钮
  saveAddBtn: (data: object) => {
    return request({
      url: '/button/addMenuButton',
      method: 'post',
      data,
    })
  },

  // 保存编辑按钮
  saveEditBtn: (data: object) => {
    return request({
      url: '/button/modifyMenuButton',
      method: 'put',
      data,
    })
  },
  // 删除按钮
  removeBtn: (data: object) => {
    return request({
      url: '/button/removeButtonByList',
      method: 'delete',
      data,
    })
  },

}

// 职位管理API
export const sysDutyApi = {
  getSysDutyList: (params: object) => {
    return request({
      url: '/duty/getList',
      method: 'get',
      params,
    })
  },

  // 添加职位信息
  saveAddDuty: (data: object) => {
    return request({
      url: '/duty/addDuty',
      method: 'post',
      data,
    })
  },

  // 编辑审批角色信息
  saveEditDuty: (data: object) => {
    return request({
      url: '/duty/modifyDuty',
      method: 'put',
      data,
    })
  },
  // 删除用户
  removeDuty: (data: object) => {
    return request({
      url: '/duty/removeDutyByList',
      method: 'delete',
      data,
    })
  },
  // 分配角色列表
  // getUserRoleList: (params: object) => {
  //   return request({
  //     url: '/userRole/getListByUserId',
  //     method: 'get',
  //     params,
  //   })
  // },
  // 保存分配角色
  // addUserRole: (data: object) => {
  //   return request({
  //     url: '/userRole/addUserRole',
  //     method: 'post',
  //     data,
  //   })
  // },

}

export const sysPaymentApi = {
  // 获取
  getSysPaymentList: (params: object) => {
    return request({
      url: '/budPay/selectList',
      method: 'get',
      params,
    })
  },

  // 添加
  saveAddPayment: (data: object) => {
    return request({
      url: '/budPay/add',
      method: 'post',
      data,
    })
  },

  // 编辑
  saveEditPayment: (data: object) => {
    return request({
      url: '/budPay/update',
      method: 'put',
      data,
    })
  },
  // 删除
  removePayment: (params: object) => {
    return request({
      url: '/budPay/delete',
      method: 'delete',
      params,
    })
  },

  removeCheckPayment: (data: object) => {
    return request({
      url: '/budPay/batchDelete',
      method: 'delete',
      data,
    })
  },

}
// 产权结构
export const sysEquityApi = {
  // 获取
  getSysEquityList: (params: object) => {
    return request({
      url: '/asset/getList',
      method: 'get',
      params,
    })
  },

  // 添加
  saveAddEquity: (data: object) => {
    return request({
      url: '/asset/addAsset',
      method: 'post',
      data,
    })
  },

  // 编辑
  saveEditEquity: (data: object) => {
    return request({
      url: '/asset/modifyAsset',
      method: 'put',
      data,
    })
  },
  // 删除
  removeEquity: (data: object) => {
    return request({
      url: '/asset/removeAssetByList',
      method: 'delete',
      data,
    })
  },

  getHeaderTitle: (params: object) => {
    return request({
      url: '/duty/getHeaderTitle',
      method: 'get',
      params,
    })
  },

  getHeaderTitleContent: (params: object) => {
    return request({
      url: '/duty/getHeaderTitleContent',
      method: 'get',
      params,
    })
  },

  addUserAssetList: (data: object) => {
    return request({
      url: '/userAsset/addUserAssetList',
      method: 'post',
      data,
    })
  },

}

export const sysLogApi = {
  // 获取所有日志
  basLogList: (params: object) => {
    return request({
      url: '/basLog/getList',
      method: 'get',
      params,
    })
  },
}

export const sysDictionaryApi = {
  // 获取所有字典
  userCanUpdateList: (params: object) => {
    return request({
      url: '/dictionary/userCanUpdate',
      method: 'get',
      params,
    })
  },

  addDictionaryDetail: (data: object) => {
    return request({
      url: '/dictionary/addDictionaryDetail',
      method: 'post',
      data,
    })
  },

  updateDictionaryDetail: (data: object) => {
    return request({
      url: '/dictionary/updateDictionaryDetail',
      method: 'put',
      data,
    })
  },

  deleteDictionaryDetail: (data: object) => {
    return request({
      url: '/dictionary/deleteDictionaryDetail',
      method: 'delete',
      data,
    })
  },

}

