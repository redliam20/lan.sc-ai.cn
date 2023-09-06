/**
 * 全站路由配置
 *
 * 建议:
 * 1. 代码中路由统一使用name属性跳转(不使用path属性)
 */
import Vue from 'vue'
import Router from 'vue-router'
import http from '@/utils/httpRequest'
import { isURL } from '@/utils/validate'
import { clearLoginInfo } from '@/utils'
import store from '@/store'

Vue.use(Router)

// 开发环境不使用懒加载, 因为懒加载页面太多的话会造成webpack热更新太慢, 所以只有生产环境使用懒加载
const _import = require('./import-' + process.env.NODE_ENV)

// 全局路由(无需嵌套上左右整体布局)
const globalRoutes = [
  { path: '/404', component: _import('common/404'), name: '404', meta: { title: '404未找到' } },
  { path: '/login', component: _import('common/login'), name: 'login', meta: { title: '登录' } },
  { path: '/stock', component: _import('modules/sls/stock'), name: 'stock', meta: { title: '实时信号' } },
  { path: '/hot-list', component: _import('modules/sls/hot-list'), name: 'hot-list', meta: { title: '港股' } },
  { path: '/signal', component: _import('modules/sls/signal'), name: 'signal', meta: { title: '信号' } },
  { path: '/favorite', component: _import('modules/sls/favorite'), name: 'favorite', meta: { title: '自选' } },
  { path: '/mine', component: _import('modules/sls/mine'), name: 'mine', meta: { title: '我的' } },
  { path: '/stock-info/:symbol:exchangeCode:from', component: _import('modules/sls/stock-info'), name: 'stock-info', meta: { title: '个股' } },
  // { path: '/favorite-info/:symbol:exchangeCode', component: _import('modules/sls/favorite-info'), name: 'favorite-info', meta: { title: '自选' } },
  { path: '/signal-info/:signalCode:signalName:periodCountName:period:count', component: _import('modules/sls/signal-info'), name: 'signal-info', meta: { title: '信号' } },
  // { path: '/advanced-setting/:symbol:exchangeCode:period:count', component: _import('modules/sls/advanced-setting'), name: 'advanced-setting', meta: { title: '高级设置' } },
  { path: '/hot-list-detail/:bang', component: _import('modules/sls/hot-list-detail'), name: 'hot-list-detail', meta: { title: '热榜明细' } }
]

// 主入口路由(需嵌套上左右整体布局)
const mainRoutes = {
  path: '/',
  component: _import('main'),
  name: 'main',
// adam20190723  redirect: { name: 'home' },
  meta: { title: '主入口整体布局' },
//   children: [
//     // 通过meta对象设置路由展示方式
//     // 1. isTab: 是否通过tab展示内容, true: 是, false: 否
//     // 2. iframeUrl: 是否通过iframe嵌套展示内容, '以http[s]://开头': 是, '': 否
//     // 提示: 如需要通过iframe嵌套展示内容, 但不通过tab打开, 请自行创建组件使用iframe处理!
// // adam20190723 { path: '/home', component: _import('common/home'), name: 'home', meta: { title: '首页' } },
// //     { path: '/main', component: _import('main'), name: 'main', meta: { title: '桌面' } },
//     { path: '/theme', component: _import('common/theme'), name: 'theme', meta: { title: '主题' } }
//   ],
  beforeEnter (to, from, next) {
    let token = Vue.cookie.get('token')
    if (!token || !/\S/.test(token)) {
      clearLoginInfo()
      next({ name: 'login' })
    }
    next()
  }
}

const router = new Router({
  mode: 'hash',
  scrollBehavior: () => ({ y: 0 }),
  isAddDynamicMenuRoutes: false, // 是否已经添加动态(菜单)路由
  routes: globalRoutes.concat(mainRoutes)
})

router.beforeEach((to, from, next) => {
  // 添加动态(菜单)路由
  // 1. 已经添加 or 全局路由, 直接访问
  // 2. 获取菜单列表, 添加并保存本地存储
  if (router.options.isAddDynamicMenuRoutes || fnCurrentRouteType(to, globalRoutes) === 'global') {
    next()
  } else {
    http({
      url: http.adornUrl('/sys/menu/nav'),
      method: 'get',
      params: http.adornParams()
    }).then(({data}) => {
      if (data && data.code === 0) {
        // let menus = data.menuList
        // 设备menu拼进去
        // for (var index in data.deviceMenus) {
        //   menus.push(data.deviceMenus[index])
        // }
        fnAddDynamicMenuRoutes(data.menuList, [], 1)
        fnAddDynamicMenuRoutes(data.deviceMenus, [], 2)
        router.options.isAddDynamicMenuRoutes = true
        sessionStorage.setItem('menuList', JSON.stringify(data.menuList || '[]'))
        sessionStorage.setItem('deviceMenuList', JSON.stringify(data.deviceMenus || '[]'))
        sessionStorage.setItem('permissions', JSON.stringify(data.permissions || '[]'))
        sessionStorage.setItem('orgList', JSON.stringify(data.orgList || '[]'))
        var token = Vue.cookie.get('token')
        store.dispatch('user/updateRoles', {token: token, roles: data.roles})
        next({ ...to, replace: true })
      } else {
        sessionStorage.setItem('menuList', '[]')
        sessionStorage.setItem('deviceMenuList', '[]')
        sessionStorage.setItem('permissions', '[]')
        sessionStorage.setItem('orgList', '[]')
        next()
      }
    }).catch((e) => {
      // console.log(`%c${e} 请求菜单列表和权限失败，跳转至登录页！！`, 'color:blue')
      router.push({ name: 'login' })
    })
  }
})

/**
 * 判断当前路由类型, global: 全局路由, main: 主入口路由
 * @param {*} route 当前路由
 */
function fnCurrentRouteType (route, globalRoutes = []) {
  var temp = []
  for (var i = 0; i < globalRoutes.length; i++) {
    if (route.path === globalRoutes[i].path) {
      return 'global'
    } else if (globalRoutes[i].children && globalRoutes[i].children.length >= 1) {
      temp = temp.concat(globalRoutes[i].children)
    }
  }
  return temp.length >= 1 ? fnCurrentRouteType(route, temp) : 'main'
}

/**
 * 添加动态(菜单)路由
 * @param {*} menuList 菜单列表
 * @param {*} routes 递归创建的动态(菜单)路由
 */
function fnAddDynamicMenuRoutes (menuList = [], routes = [], type) {
  var temp = []
  for (var i = 0; i < menuList.length; i++) {
    if (menuList[i].list && menuList[i].list.length >= 1) {
      temp = temp.concat(menuList[i].list)
    } else if (menuList[i].url && /\S/.test(menuList[i].url)) {
      menuList[i].url = menuList[i].url.replace(/^\//, '')
      var route = {
        path: menuList[i].url.replace('/', '-'),
        component: null,
        name: menuList[i].url.replace('/', '-'),
        meta: {
          menuId: menuList[i].menuId,
          title: menuList[i].name,
          isDynamic: true,
          isTab: false,
          iframeUrl: '',
          type: type
        }
      }
      // url以http[s]://开头, 通过iframe展示
      if (isURL(menuList[i].url)) {
        route['path'] = `i-${menuList[i].menuId}`
        route['name'] = `i-${menuList[i].menuId}`
        route['meta']['iframeUrl'] = menuList[i].url
      } else {
        try {
          route['component'] = _import(`modules/${menuList[i].url}`) || null
        } catch (e) {}
      }
      routes.push(route)
    }
  }
  if (temp.length >= 1) {
    fnAddDynamicMenuRoutes(temp, routes, type)
  } else {
    mainRoutes.name = 'main-dynamic'
    mainRoutes.children = routes
    router.addRoutes([
      mainRoutes,
      { path: '*', redirect: { name: '404' } }
    ])

    sessionStorage.setItem(type === 1 ? 'dynamicMenuRoutes' : 'dynamicDeviceMenuRoutes',
      JSON.stringify(mainRoutes.children || '[]'))
    console.log('\n')
    console.log('%c!<-------------------- 动态(菜单)路由 s -------------------->', 'color:blue')
    console.log(mainRoutes.children)
    console.log('%c!<-------------------- 动态(菜单)路由 e -------------------->', 'color:blue')
  }
}

// function getDeviceGroupTree () {
//   http({
//     url: http.adornUrl('/deviceGroup/getGroupTree'),
//     method: 'get'
//   }).then(({data}) => {
//     if (data && data.code === 0) {
//       console.log(data.data)
//       deviceGroupTree = data.data
//     }
//   }).catch((e) => {
//     console.log(`%c${e} 请求组点设备树失败，跳转至登录页！！`, 'color:blue')
//     router.push({ name: 'login' })
//   })
// }

export default router
