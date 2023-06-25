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
  assetName: {
    required: true,
    message: '请输入产权结构名称',
    trigger: 'blur',
  },
  assetCode: {
    required: true,
    message: '请输入产权结构编码',
    trigger: 'blur',
  },

  abbreviation: {
    required: true,
    message: '请输入产权结构简称',
    trigger: 'blur',
  },
  // branchId: {
  //   type: 'number',
  //   required: true,
  //   message: '请输入管理结构',
  //   trigger: ['blur', 'change'],
  // },
  // parentId: {
  //   type: 'number',
  //   required: true,
  //   message: '请输入父级产权结构',
  //   trigger: ['blur', 'change'],
  // },
  assetType: {
    type: 'number',
    required: true,
    message: '请输入产权类型',
    trigger: ['blur', 'change'],
  },
  legalRepresentative: {
    required: true,
    message: '请输入法人代表',
    trigger: 'blur',
  },
  taxNo: {
    required: true,
    message: '请输入纳税号',
    trigger: 'blur',
  },

}
