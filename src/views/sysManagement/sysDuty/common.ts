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
  dutyCode: {
    required: true,
    message: '请输入职位编码',
    trigger: 'blur',
  },
  dutyName: {
    required: true,
    message: '请输入职位名称',
    trigger: 'blur',
  },
  sort: {
    type: 'number',
    required: true,
    message: '请输入排序',
    trigger: 'blur',
  },

}
