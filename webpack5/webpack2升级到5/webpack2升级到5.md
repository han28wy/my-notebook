### package.json里

```
  "scripts": {
    "dev": "cross-env NODE_ENV=dev webpack-dev-server --mode development",
    "test": "cross-env NODE_ENV=test webpack-dev-server --mode development",
    "prod": "cross-env NODE_ENV=prod webpack-dev-server --mode development",
    "build": "webpack --config ./webpack.config.js",
  },
```

### 一些依赖修改
![打包依赖修改]('./1.PNG')
![babel修改]('./2.PNG')
![eslint，html-webpack修改]('./3.PNG')

###  babel配置修改
删除.babelrc文件，增加babel.config.js文件
```
module.exports = {
  presets: ['@babel/preset-env'],
  plugins: [    
    ['import', 
   {      
    libraryName: 'vant',      
    libraryDirectory: 'es',      
    style: true    
   }, 'vant']  
  ]
};
```

### 增加webpack.config.js等配置文件

### main.js修改
```
<!-- 修改前： -->
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>',
})

<!-- 修改后 -->
new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app')
```

### pdf预览插件修改
vue-pdf 改为 @vue-office/pdf

### 解决Css Loading Chunk Failed 问题
因为代码修改了，但是部署后依旧读取缓存中的文件，又不能做清理缓存操作；
解决办法：
nginx配置cache no store：
add_header Cache-Control no-store;

路由中做异常处理：
route.onError((error) => {
  console.log('路由onError', error)
  const pattern = /Loading chunk (\d)+ failed/g
  const isChunkLoadFailed = error.message.match(pattern)
  const targetPath = route.history.pending.fullPath
  if (isChunkLoadFailed) {
    route.replace(targetPath)
  }
})

