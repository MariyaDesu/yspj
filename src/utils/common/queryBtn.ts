export function showBtn(flag: string, features: Array<any> = []) {
  if (features.length === 0)
    return false

  const obj = features?.find((it) => {
    return flag === it.buttonText
  })
  return Boolean(obj?.status)
}

export function showBtnLength(flagArr: Array<string>, features: Array<any> = []) {
  let num = 0
  flagArr.forEach((item) => {
    if (showBtn(item, features))
      num = num + 1
  })
  return num
}

