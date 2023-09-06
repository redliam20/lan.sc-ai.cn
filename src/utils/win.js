import store from '@/store'
import * as validate from './validate'

export const close = function () {
  store.commit('common/updateShowDeskTop', true)
  window.history.pushState({time: new Date().getTime()}, '', '/#/')
}

export const showDesktop = function (showDT) {
  if (validate.isBlank(showDT)) {
    return store.state.common.showDesktop
  } else {
    store.commit('common/updateShowDeskTop', showDT)
  }
}

export const menuActived = function (menuName) {
  if (validate.isBlank(menuName)) {
    return store.state.common.menuActived
  } else {
    store.commit('common/updateMenuActived', menuName)
  }
}
