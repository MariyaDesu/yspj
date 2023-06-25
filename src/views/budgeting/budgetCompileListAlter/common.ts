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
  compileCode: {
    required: true,
    message: '请输入预算编制代码',
    trigger: 'blur',
  },
  compileName: {
    required: true,
    message: '请输入预算事项',
    trigger: 'blur',
  },
  budProgrammeId: {
    type: 'number',
    required: true,
    message: '请选择预算方案',
    trigger: ['blur', 'change'],
  },

  // preparationDescription: {
  //   required: true,
  //   message: '请输入编制说明',
  //   trigger: 'blur',
  // },

  assetId: {
    type: 'number',
    required: true,
    message: '请选择产权结构',
    trigger: ['blur', 'change'],
  },

  branchId: {
    type: 'number',
    required: true,
    message: '请选择管理结构',
    trigger: ['blur', 'change'],
  },

  deptId: {
    type: 'number',
    required: true,
    message: '请选择部门',
    trigger: ['blur', 'change'],
  },

  feeType: {
    type: 'number',
    required: true,
    message: '请选择预算类型',
    trigger: ['blur', 'change'],
  },

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
