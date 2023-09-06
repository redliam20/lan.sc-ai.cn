import store from '@/store'
import Vue from 'vue'

export const hasAdminRole = function () {
  var roles = []
  if (store.state.user.roles) {
    roles = store.state.user.roles.concat()
    if (roles.indexOf('admin') !== -1) {
      return true
    }
  } else {
    let token = Vue.cookie.get('token')
    if (sessionStorage.getItem(token)) {
      roles = sessionStorage.getItem(token).concat()
      store.dispatch('user/updateRoles', {token: token, roles: roles})
      if (roles.indexOf('admin') !== -1) {
        return true
      }
      return false
    } else {
      return false
    }
  }
  return false
}
