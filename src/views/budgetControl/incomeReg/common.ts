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
  budControlPayCode: {
    required: true,
    message: '请输入收入编号',
    trigger: 'blur',
  },
  bankType: {
    type: 'number',
    required: true,
    message: '请选择支付方式',
    trigger: ['blur', 'change'],
  },
  // bankName: {
  //   required: true,
  //   message: '请输入银行名称',
  //   trigger: 'blur',
  // },

  // bankAccountNumber: {
  //   required: true,
  //   message: '请输入银行账号',
  //   trigger: 'blur',
  // },

}
