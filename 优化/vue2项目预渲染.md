#### vue-router的hash模式转history模式
项目框架：vue2+webpack5
1 vue-router模式修改
```
// Router index.js
 mode: 'history',
  routes: [
    {
      path: '/',
      name: 'home',
      component: loadView('home', 'views'),
    },
```
2 webpack配置修改
Vue.config.js
    historyApiFallback: {
      index: '/index.html'
}
3 nginx修改
增加了try_files这部分
location /location{
    alias /data/dist;
    try_files $uri $uri/ /location/index.html;
}
4 部署后的白屏问题
router/index.js里面增加配置
    mode: 'history',
    base: '/******/',
