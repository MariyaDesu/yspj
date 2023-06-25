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

  assetId: {
    type: 'number',
    required: true,
    message: '产权结构名称',
    trigger: ['blur', 'change'],
  },

  branchId: {
    type: 'number',
    required: true,
    message: '请选择管理结构名称',
    trigger: ['blur', 'change'],
  },

  // bankType: {
  //   type: 'number',
  //   required: true,
  //   message: '请选择支付类型',
  //   trigger: ['blur', 'change'],
  // },

}
