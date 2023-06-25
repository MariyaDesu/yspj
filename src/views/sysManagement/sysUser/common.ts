interface ruleDetail {
  required: boolean
  type?: any
  message: string
  trigger: any
}
interface rule {
  [propName: string]: ruleDetail
}
export const rules: rule = {
  userName: {
    required: true,
    message: '请输入账号',
    trigger: 'blur',
  },
  password: {
    required: true,
    message: '请输入密码',
    trigger: 'blur',
  },
  linkmanName: {
    required: true,
    message: '请输入联系人',
    trigger: 'blur',
  },
  linkmanMobile: {
    // type: 'number',
    required: true,
    message: '请输入联系人电话',
    trigger: 'blur',
  },
  branchId: {
    type: 'number',
    required: true,
    message: '请输入管理结构名称',
    trigger: ['blur', 'change'],
  },

}
