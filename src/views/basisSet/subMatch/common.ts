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
  budSubjectId: {
    type: 'number',
    required: true,
    message: '请输入预算科目编码',
    trigger: ['blur', 'change'],
  },
  ifAuxiliary: {
    required: true,
    message: '请选择是否辅助核算',
    trigger: 'blur',
  },
}
