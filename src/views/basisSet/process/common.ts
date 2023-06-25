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
  processCode: {
    required: true,
    message: '请输入流程编码',
    trigger: 'blur',
  },
  processName: {
    required: true,
    message: '请输入流程名称',
    trigger: 'blur',
  },
  billTypeId: {
    type: 'number',
    required: true,
    message: '请选择单据类型',
    trigger: ['blur', 'change'],
  },

  // subjectId: {
  //   type: 'number',
  //   required: true,
  //   message: '请选择科目',
  //   trigger: ['blur', 'change'],
  // },

  // beginYear: {
  //   required: true,
  //   message: '请输入方案日期',
  //   trigger: 'blur',
  // },
  // beginPeriod: {
  //   type: 'number',
  //   required: true,
  //   message: '请输入方案开始期数',
  //   trigger: 'blur',
  // },
  // formulateDate: {
  //   required: true,
  //   message: '请输入方案制定时间',
  //   trigger: 'blur',
  // },

}
