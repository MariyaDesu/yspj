import type { CascaderOption, SelectOption } from 'naive-ui'

export namespace Search {
  export interface ISearch {
    compileCode?: string
    assetId?: number
    branchId?: number
    deptId?: number
    state?: number
    budProgrammeId?: number
  }

  export interface IOption {

    branchOptions?: SelectOption[]
    deptOptions?: CascaderOption[]
    assetOptions: SelectOption[]
    stateOptions: SelectOption[]
    budProOptions: SelectOption[]

  }

  export interface ILoading {
    import?: boolean
    export?: boolean
    download?: boolean
    edit?: boolean
    submitList?: boolean
    submitProessList?: boolean
    search?: boolean
  }
}

export namespace Edit {
  export interface RowData {
    id: number
    name: string
    index: number
    baseNumber: number
    budSubjectId: number
    matter: string
    contractNumber: string
    assetId: number
    branchId: number
    signingUnit: string
    contractAmount: string
    shouldPayAmount: string
    paidAmount: string
    unpaidAmount: string
    deptId: string
  }
  export interface IOption {
    budProOptions?: SelectOption[]
    budSubOptions?: CascaderOption[]
    assetOptions?: SelectOption[]
    contractStateOptions?: SelectOption[]
    feeTypeOptions?: SelectOption[]
    branchOptions?: SelectOption[]
    deptOptions?: CascaderOption[]
  }
  export interface IMainData {
    code?: string
    budSubjectId?: string
    budProgrammeId?: string
    preparationDescription?: string
    compileCode?: string
    compileName?: string
    baseNumber?: number
    budCompileList?: Array<any>
    preparationId?: string
    createdId?: string
    modifiedId?: string
    preparationName?: string
    createdName?: string
    modifiedName?: string
    assetId?: string
    deptId?: string
    branchId?: string
    contractState?: number
    feeType?: number
    preparationTime?: string
    projectName?: string
  }
  export interface IData {
    modalVisible: boolean
    editData: object
    mainData: IMainData
    name: string
    showTable: boolean
    oldtable?: Array<any>
    showModal: boolean
    showAdjust: boolean
    keyIndex: number
    summary?: number
    fileIndex: number
    fileEditIndex: any
  }
}

export namespace Process {
  export interface IMainData {
    processId?: string
    processName?: string
    deptId?: string
    subjectId?: string
    processCode?: string
    billTypeId?: string
    nodes: Array<any>
    dutyId?: string
    opId?: string
    enable?: number
    branchId?: number
    billTypeName?: string
  }

  export interface IData {
    id?: string
    assetId?: string
    deptId?: string
    compileName?: string
    deptName?: string
    assetName?: string
    modalVisible: boolean
    editData: object
    mainData: IMainData
    audit?: boolean
    duty?: boolean
    newData: object
  }

  export interface IOption {

    branchOptions?: SelectOption[]
    deptOptions?: CascaderOption[]
    approverOptions: SelectOption[]
    dutyOptions: SelectOption[]
    billTypeOptions: SelectOption[]

  }
}
