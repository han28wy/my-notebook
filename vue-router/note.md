### 从vue-router的使用步骤开始读源码
1 在vue2项目里的应用
main.js
import router from './router'
  /* eslint-disable no-new */
  new Vue({
    components: { App },
    el: '#app',
    router,
    store,
    template: '<App/>'
  })


router/index.js
import Router from 'vue-router'
Vue.use(Router)
const router = new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/about',
      name: 'about',
      component: About
    }
  ]
})

 router.beforeEach((to, from, next) => {
    next()
 })

export default router

2 源码学习 创建类 VueRouter

构造了一些东西：
初始化路由配置 options
创建路由匹配器 matcher
设置路由模式 mode
创建路由历史 history
设置路由历史监听器
设置路由导航钩子（beforeEach、beforeResolve 和 afterEach）
设置路由完成钩子（onReady）和路由错误钩子（onError）
为了完成：
定义了 VueRouter 的 beforeEach、beforeResolve 和 afterEach 方法，用于注册钩子函数。
定义了 VueRouter 的 onReady 和 onError 方法，用于处理路由导航完成和路由错误事件。
定义了 VueRouter 的 push、replace 和 go 方法，用于实现页面导航。
定义了 VueRouter 的 getMatchedComponents 方法，用于获取与给定路由匹配的组件。
定义了 VueRouter 的 resolve 方法，用于解析给定的 location 和当前路由（currentRoute），并返回解析后的 location、route 和 href。
定义了 VueRouter 的 addRoutes 方法，用于添加路由配置。
定义了 VueRouter 的静态方法 registerHook 和 createHref，分别用于注册钩子函数和创建 href。
定义了 VueRouter 的静态属性 static properties，包括 install 和 version。
最后，判断是否在浏览器环境下，如果存在 window.Vue 对象，则将 VueRouter 安装到 Vue 中。

3 一些怎么做的问题
