/* eslint-disable no-prototype-builtins */

// 深复制（包含复杂模式）

export function deepCopy(obj: any) {
  const objArray = Array.isArray(obj) ? [] : {}
  if (obj && typeof obj === 'object') {
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        if (obj[key] && typeof obj[key] === 'object')
          objArray[key] = deepCopy(obj[key])
        else objArray[key] = obj[key]
      }
    }
  }
  return objArray
}

// num为传入的值，n为保留的小数位
export function fomatFloat(num, n) {
  let f = parseFloat(num)
  if (isNaN(f))
    return false

  f = Math.round(num * 10 ** n) / 10 ** n // n 幂
  let s = f.toString()
  let rs = s.indexOf('.')
  // 判定如果是整数，增加小数点再补0
  if (rs < 0) {
    rs = s.length
    s += '.'
  }
  while (s.length <= rs + n) s += '0'

  return s
}

export const readFile = (file) => {
  return new Promise((resolve) => {
    const reader = new FileReader()
    reader.readAsBinaryString(file)
    reader.onload = (ev) => {
      resolve(ev?.target?.result)
    }
  })
}

export const setChildrenList = (data, fn) => {
  data.forEach((item) => {
    if (item.statementList) {
      setChildrenList(item.statementList, fn)
    }
    else {
      fn(item.codeAndName).then((res) => {
        item.statementList = res
      })
    }
  })
  return data
}

export const keepTwoDecimalStr = (num: number) => {
  const result = Number(num.toString().match(/^\d+(?:\.\d{0,2})?/))

  let s = result.toString()
  let rs = s.indexOf('.')
  if (rs < 0) {
    rs = s.length
    s += '.'
  }
  while (s.length <= rs + 2)
    s += '0'
  return s
}
