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
  roleCode: {
    required: true,
    message: '请输入角色编码',
    trigger: 'blur',
  },
  roleName: {
    required: true,
    message: '请输入角色名称',
    trigger: 'blur',
  },
  sort: {
    type: 'number',
    required: true,
    message: '请输入排序',
    trigger: 'blur',
  },

}
