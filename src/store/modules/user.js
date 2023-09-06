import Vue from 'vue'

export default {
  namespaced: true,
  state: {
    id: 0,
    name: '',
    roles: []
  },
  mutations: {
    updateId (state, id) {
      state.id = id
    },
    updateName (state, name) {
      state.name = name
    },
    updateRoles (state, data) {
      state.roles = data.roles
      sessionStorage.setItem(data.token, data.roles)
    }
  },
  actions: {
    updateRoles (context, data) {
      context.commit('updateRoles', data)
    }
  },
  getters: {
    getRoles (state) {
      if (state.roles || state.roles.length < 1) {
        let token = Vue.cookie.get('token')
        if (sessionStorage.getItem(token)) {
          state.roles = sessionStorage.getItem(token)
        }
      }
      return state.roles
    },
    getName (state) {
      if (state.roles || state.roles.length < 1) {
        let token = Vue.cookie.get('token')
        if (sessionStorage.getItem(token)) {
          state.roles = sessionStorage.getItem(token)
        }
      }
      return state.name
    }
  }
}
