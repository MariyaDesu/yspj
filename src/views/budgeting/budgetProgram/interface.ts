export namespace budgetProgramEdit{
  export interface IMainData {
    code?: string
    name?: string
    type?: number
    beginPeriod?: number
    beginYear?: string
    formulateDate?: string
    scrollBudget?: string
  }
  export interface IData {
    modalVisible: boolean
    editData: IMainData
    mainData: IMainData
    isDisable: boolean
  }
}

export namespace budgetProgramSearch{
  export interface Isearch {
    keyWord?: string
  }
}

export namespace budgetProgramTable{
  export interface RowData {
    id: string
    editStatus: number
    executeStatus: number
    editStatusName: string
    executeStatusName: string
    name: string
    typeName: string
    formulateDate: string
  }
}

export namespace budgetProgramCommon{
  export interface ruleDetail {
    required: boolean
    type?: any
    message: string
    trigger: any

  }
  export interface rule {
    [propName: string]: ruleDetail
  }
}

