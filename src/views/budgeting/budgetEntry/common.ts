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
  code: {
    required: true,
    message: '请输入预算科目类别代码',
    trigger: 'blur',
  },
  name: {
    required: true,
    message: '请输入预算科目类别名称',
    trigger: 'blur',
  },
  // parentId: {
  //   type: 'number',
  //   required: true,
  //   message: '请选择目录',
  //   trigger: ['blur', 'change'],
  // },

  budBalanceDirection: {
    type: 'number',
    required: true,
    message: '请选择余额方向',
    trigger: ['blur', 'change'],
  },

}
