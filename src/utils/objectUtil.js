export function objectEquals (objA, objB) {
  if (!isObj(objA) || !isObj(objB)) {
    console.log('one is not obj')
    return false
  }
  if (Object.keys(objA).length !== Object.keys(objB).length) {
    console.log('length is not eq')
    return false
  }
  return CompareObj(objA, objB, true)
}

function CompareObj (objA, objB, flag) {
  for (const key in objA) {
    if (!flag) { // 跳出整个循环
      break
    }
    if (!objB.hasOwnProperty(key)) {
      console.log('B doesnot contain A.property')
      flag = false
      break
    }
    if (!isArray(objA[key])) { // 子级不是数组时,比较属性值
      if (objB[key] !== objA[key]) {
        flag = false
        console.log(key + ': value is not eq')
        break
      }
    } else {
      if (!isArray(objB[key])) {
        flag = false
        break
      }
      const oA = objA[key]
      const oB = objB[key]
      if (oA.length !== oB.length) {
        flag = false
        break
      }
      for (const k in oA) {
        if (!flag) { // 这里跳出循环是为了不让递归继续
          break
        }
        flag = CompareObj(oA[k], oB[k], flag)
      }
    }
  }
  return flag
}

function isObj (object) {
  return object && typeof (object) === 'object' &&
    Object.prototype.toString.call(object).toLowerCase() === '[object object]'
}

function isArray (object) {
  return object && typeof (object) === 'object' && object.constructor === Array
}
