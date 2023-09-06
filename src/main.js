import 'babel-polyfill'
import 'event-source-polyfill'
import Vue from 'vue'
import App from '@/App'
import router from '@/router'                 // api: https://github.com/vuejs/vue-router
import store from '@/store'                   // api: https://github.com/vuejs/vuex
import VueCookie from 'vue-cookie'            // api: https://github.com/alfhen/vue-cookie
import '@/element-ui'                         // api: https://github.com/ElemeFE/element
import '@/icons'                              // api: http://www.iconfont.cn/
import '@/element-ui-theme'
import '@/assets/scss/index.scss'
import httpRequest from '@/utils/httpRequest' // api: https://github.com/axios/axios
import * as Win from '@/utils/win'
import { isAuth } from '@/utils'
import * as validate from '@/utils/validate'
import cloneDeep from 'lodash/cloneDeep'
import VueSSE from '@/utils/vue-sse'
import '@/utils/directives'
import {showPeriod} from './utils/slsUtil'

Vue.use(VueCookie)
Vue.use(VueSSE)

Vue.config.productionTip = false

// 非生产环境, 适配mockjs模拟数据                 // api: https://github.com/nuysoft/Mock
if (process.env.NODE_ENV !== 'production') {
  // require('@/mock')
}

// 挂载全局
Vue.prototype.$http = httpRequest // ajax请求方法
Vue.prototype.isAuth = isAuth     // 权限方法
Vue.prototype.$deepClone = cloneDeep  // 深拷贝对象
Vue.prototype.$validate = validate  // 校验对象
Vue.prototype.$title = '短线精灵'
Vue.prototype.$loginBg = 'custom/img/login_bg.jpg'
Vue.prototype.$logo = 'custom/img/logo.png'
Vue.prototype.$documentWidth = document.body.clientWidth
Vue.prototype.$documentHeight = document.body.clientHeight
Vue.prototype.$config = {}
Vue.prototype.$win = Win
Vue.prototype.$activeMenu = { item: 'stock' }
Vue.prototype.$globalShowPeriod = showPeriod

// 保存整站vuex本地储存初始状态
window.SITE_CONFIG['storeState'] = cloneDeep(store.state)

// 请求文件内容
function getServerConfig () {
  return new Promise((resolve, reject) => {
    httpRequest({
      url: '/custom/serverConfig.json',
      method: 'get',
      params: httpRequest.adornParams()
    }).then(({data}) => {
      Vue.prototype.$config = data
      resolve()
      Vue.prototype.$title = Vue.prototype.$config.title ? Vue.prototype.$config.title : Vue.prototype.$title
      Vue.prototype.$loginBg = Vue.prototype.$config.loginBg ? Vue.prototype.$config.loginBg : Vue.prototype.$loginBg
      Vue.prototype.$logo = Vue.prototype.$config.logo ? Vue.prototype.$config.logo : Vue.prototype.$logo
    })
  })
}

// 请求文件内容及创建实例
async function main () {
  if (process.env.NODE_ENV === 'production') {
    await getServerConfig()
  } else {
    Vue.prototype.$config = {}
    Vue.prototype.$loginBg = '/static/img/login_bg.jpg'
    Vue.prototype.$logo = '/static/img/logo.png'
  }
  /* eslint-disable no-new */
  new Vue({
    el: '#app',
    router,
    store,
    template: '<App/>',
    components: { App }
  })
}

main()
