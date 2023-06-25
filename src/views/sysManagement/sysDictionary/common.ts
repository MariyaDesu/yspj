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
  // branchType: {
  //   type: 'number',
  //   required: true,
  //   message: '请选择管理结构类型名称',
  //   trigger: ['blur', 'change'],
  // },

  // tell: {
  //   required: true,
  //   message: '请输入联系电话',
  //   trigger: 'blur',
  // },
  // fax: {
  //   required: true,
  //   message: '请输入传真',
  //   trigger: 'blur',
  // },
  // bankNo: {
  //   required: true,
  //   message: '请输入银行账号',
  //   trigger: 'blur',
  // },
  // legalRepresentative: {
  //   required: true,
  //   message: '请输入法人代表',
  //   trigger: 'blur',
  // },

  bankId: {
    type: 'number',
    required: true,
    message: '请选择银行',
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
