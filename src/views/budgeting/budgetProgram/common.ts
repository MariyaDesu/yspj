import type { budgetProgramCommon } from './interface'
export const rules: budgetProgramCommon.rule = {
  code: {
    required: true,
    message: '请输入方案代码',
    trigger: 'blur',
  },
  name: {
    required: true,
    message: '请输入方案名称',
    trigger: 'blur',
  },
  type: {
    type: 'number',
    required: true,
    message: '请选择预算期间',
    trigger: ['blur', 'change'],
  },

  beginYear: {
    required: true,
    message: '请输入方案日期',
    trigger: 'blur',
  },
  beginPeriod: {
    type: 'number',
    required: true,
    message: '请输入方案开始期数',
    trigger: 'blur',
  },
  formulateDate: {
    required: true,
    message: '请输入方案制定时间',
    trigger: 'blur',
  },

}
