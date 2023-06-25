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
  branchCode: {
    required: true,
    message: '请输入管理结构编码',
    trigger: 'blur',
  },
  branchName: {
    required: true,
    message: '请输入管理结构名称',
    trigger: 'blur',
  },

  bankId: {
    type: 'number',
    required: true,
    message: '请选择银行',
    trigger: ['blur', 'change'],
  },

}
