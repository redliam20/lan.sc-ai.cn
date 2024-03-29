import Vue from 'vue'
import router from '@/router'
import store from '@/store'

/**
 * 获取uuid
 */
export function getUUID () {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    return (c === 'x' ? (Math.random() * 16 | 0) : ('r&0x3' | '0x8')).toString(16)
  })
}

/**
 * 是否有权限
 * @param {*} key
 */
export function isAuth (key) {
  return JSON.parse(sessionStorage.getItem('permissions') || '[]').indexOf(key) !== -1 || false
}

/**
 * 树形数据转换
 * @param {*} data
 * @param {*} id
 * @param {*} pid
 */
export function treeDataTranslate (data, id = 'id', pid = 'parentId') {
  var res = []
  var temp = {}
  for (var i = 0; i < data.length; i++) {
    temp[data[i][id]] = data[i]
  }
  for (var k = 0; k < data.length; k++) {
    if (temp[data[k][pid]] && data[k][id] !== data[k][pid]) {
      if (!temp[data[k][pid]]['children']) {
        temp[data[k][pid]]['children'] = []
      }
      if (!temp[data[k][pid]]['_level']) {
        temp[data[k][pid]]['_level'] = 1
      }
      data[k]['_level'] = temp[data[k][pid]]._level + 1
      temp[data[k][pid]]['children'].push(data[k])
    } else {
      res.push(data[k])
    }
  }
  return res
}

/**
 * 根据orgNo翻译为orgName
 * @param orgNo
 */
export function transOrg (orgNo) {
  let orgList = JSON.parse(sessionStorage.getItem('orgList') || '[]')
  if (orgList.length > 0) {
    for (let i = 0; i < orgList.length; i++) {
      if (orgList[i].orgNo === orgNo) {
        return orgList[i].orgName
      }
    }
  }
  return '--'
}

/**
 * 根据userId翻译为realName
 * @param userId
 */
export function transUser (userId) {
  let userList = JSON.parse(sessionStorage.getItem('userList') || '[]')
  if (userList.length > 0) {
    for (let i = 0; i < userList.length; i++) {
      if (userList[i].userId === userId) {
        return userList[i].realName
      }
    }
  }
  return '--'
}

/**
 * 清除登录信息
 */
export function clearLoginInfo () {
  Vue.cookie.delete('token')
  store.commit('resetStore')
  router.options.isAddDynamicMenuRoutes = false
}
