## webpack3->vue-cli5
#### package.json
```
原：
 "dev": "cross-env NODE_ENV=dev webpack-dev-server --inline --progress --config build/webpack.dev.conf.js",
    "test": "cross-env NODE_ENV=test webpack-dev-server --inline --progress --config build/webpack.dev.conf.js",
    "prod": "cross-env NODE_ENV=prod webpack-dev-server --inline --progress --config build/webpack.dev.conf.js",
    "build": "node build/build.js",
改为：
    "dev": "vue-cli-service serve",
    "test": "vue-cli-service serve --mode test",
    "prod": "vue-cli-service serve --mode production",
    "build": "vue-cli-service build",
    "lint": "vue-cli-service lint"
```
依赖变化
babel升级到7
vue-template-compiler 2.6
webpack 5.91.0
vue-loader 13.3.0

#### babel配置
删除.babelrc 新建babel.config.js


#### 打包配置
新建vue.config.js
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

#### pdf预览处理
之前用的vue-pdf 发现打不开pdf了
vue.config.js配置解析.pdf
```
config.module
      .rule('pdf')
      .test(/\.(pdf)$/)
      .use('url-loader')
      .loader('url-loader')
      .options({
        limit: 10000,
      })
      .end()
```

换一个插件
npm install @vue-office/pdf

#### TODO: xg-player 自定义样式下
无法使用插件
