// 短线精灵的各种公用函数

export function showPeriod (periodCountName) {
  if (periodCountName !== null && periodCountName.length > 0) {
    let list = periodCountName.split('、')
    if (list.length > 0) {
      return list[0]
    }
  }
  return ''
}
