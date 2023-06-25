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
  deptCode: {
    required: true,
    message: '请输入部门编码',
    trigger: 'blur',
  },
  deptName: {
    required: true,
    message: '请输入部门名称',
    trigger: 'blur',
  },
  assetId: {
    type: 'number',
    required: true,
    message: '请输入产权结构',
    trigger: ['blur', 'change'],
  },

}
