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
  businessObjectType: {
    type: 'number',
    required: true,
    message: '请输入单据类型',
    trigger: 'blur',
  },
  // codeName: {
  //   required: true,
  //   message: '请输入单据代号',
  //   trigger: 'blur',
  // },
  // codingType: {
  //   type: 'number',
  //   required: true,
  //   message: '请选择编码方式',
  //   trigger: ['blur', 'change'],
  // },
  // separators: {
  //   type: 'number',
  //   required: true,
  //   message: '请选择分割符',
  //   trigger: ['blur', 'change'],
  // },
  // startCode: {
  //   required: true,
  //   message: '请输入起始编号',
  //   trigger: 'blur',
  // },

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
