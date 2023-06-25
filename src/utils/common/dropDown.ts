// 格式化下拉菜单
export function formatDrop(data: Array<any>) {
  for (let i = 0; i < data.length; i++) {
    if (data[i].children.length < 1) {
      // children若为空数组，则将children设为undefined
      data[i].children = undefined
    }
    else {
      // children若不为空数组，则继续 递归调用 本方法
      formatDrop(data[i].children)
    }
  }
  return data
}

// 清空children
export function formatSelectDrop(data: Array<any>) {
  for (let i = 0; i < data.length; i++) {
    if (data[i].children)
      data[i].children = undefined
  }
  return data
}

export function formatProcess(data: Array<any>) {
  for (let i = 0; i < data.length; i++) {
    for (let j = 0; j < data[i].audits.length; j++) {
      if (data[i].audits[j].dutyId)
        data[i].audits[j].opId = data[i].audits[j].dutyId

      else if (data[i].audits[j].userId)
        data[i].audits[j].opId = data[i].audits[j].userId
    }
  }
  return data
}

export function formatNewProcess(data: Array<any>) {
  for (let i = 0; i < data.length; i++) {
    for (let j = 0; j < data[i].audits.length; j++) {
      if (data[i].audits[j].auditType === 1) {
        data[i].audits[j].userId = data[i].audits[j].opId
        data[i].audits[j].dutyId = ''
      }
      else if (data[i].audits[j].auditType === 2) {
        data[i].audits[j].dutyId = data[i].audits[j].opId
        data[i].audits[j].userId = ''
      }
    }
  }
  return data
}

export function formatNewsProcess(data: Array<any>) {
  for (let i = 0; i < data.length; i++) {
    for (let j = 0; j < data[i].audits.length; j++) {
      if (data[i].audits[j].auditType === 1) {
        data[i].audits[j].userId = data[i].audits[j].opId
        data[i].audits[j].dutyId = ''
      }
      else if (data[i].audits[j].auditType === 2) {
        if (data[i].audits[j].auditTypeId) {
          data[i].audits[j].userId = data[i].audits[j].auditTypeId
          data[i].audits[j].dutyId = ''
        }
        else {
          data[i].audits[j].userId = ''
          data[i].audits[j].dutyId = data[i].audits[j].opId
        }
      }
    }
  }
  return data
}
