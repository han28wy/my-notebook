### 项目中webpack3配置需要知道的
#### package.json配置打包脚本
dev,build: 自定义脚本名称
cross-env：设置环境变量的命令
webpack-dev-server ： 运行这个命令
inline ：在浏览器中使用内联模式，以支持实时重新加载（live reloading）
progress ：控制台中显示打包进度
config：使用指定的Webpack配置文件进行打包，此处的配置文件路径为build/webpack.dev.conf.js

node：使用Node.js运行build/build.js脚本
#### 必要的loader
vue-loader: 解析和转换vue文件
vue-style-loader：Vue组件中的样式转换为CSS并将其注入到页面中
css-loader：解析处理CSS文件，使其能够在JavaScript中被引用
postcss-loader：
sass-resources-loader：
babel-loader：ES6+的JavaScript代码转换为兼容的ES5
iview-loader
file-loader/url-loader：处理静态资源文件（如图片、字体等），使其能够在JavaScript中被引用
eslint-loader：

#### 必要的plugin
HtmlWebpackPlugin：生成一个html5文件，在这个文件里添加script标签引入打包的bundle,css资源在<head>里以link标签引入；
VueLoaderPlugin：解析和处理vue文件的css
ExtractTextWebpackPlugin：把css从js文件抽出来，形成单独的模块
UglifyJsWebpackPlugin：压缩混淆JavaScript代码
CopyWebpackPlugin

### 项目中用vue-cli4生成vue2+webpack4的项目需要知道的
#### package.json配置打包搅拌
vue-cli-service: serve ,build 
--mode: staging 是构建命令的选项

#### 在package.json里没有webpack4的包了
vue-cli4用了@vue/cli-service的依赖包来处理项目的构建和打包，并且这里面含了webpack的相关配置和插件；
#### vue.congif.js配置文件

### webpack这几个版本都用过吗，有什么区别
#### webpack3
1 运行脚本
  "scripts": {
    "dev": "cross-env NODE_ENV=development webpack-dev-server --inline --progress --config build/webpack.dev.conf.js",
    "build": "node build/build.js",
  },
2 配置文件

#### webpack4
1 运行脚本
  "scripts": {
    "serve": "vue-cli-service serve",
    "build": "vue-cli-service build --mode staging",
  },
2 配置文件
vue.config.js文件

### webpack打包流程是什么
1 读取配置文件
2 入口
从entry开始准备分析依赖关系
3 构建依赖图
从entry的文件开始，递归遍历各个文件，构建依赖关系图
4 loader
例如将ES6代码转换为ES5代码，或者将CSS转换为JavaScript对象
5 优化策略，代码分割
Tree-shaking、代码压缩、作用域提升、代码分割等
6 输出
output
7 plugin


### 介绍loader和plugin
Loader能处理非js类型的文件，转成成能被webpack处理的。
Plugin执行功能

### 有哪些常用的loader和plugin

### 怎么编写Loader
```
module.exports = function(sources) {// 输入的是文件，输出处理函数
    用this访问上下文
  }
```

### 怎么编写plugin
```
class Plugin {
    constructor(options) {
        this.options = options // 接收的参数
    }
    apply(compiler){

    }
}
module.exports = Plugin
```

### 用webpack对项目做优化

### tree-shaking 实现原理是怎样的？
在打包中去除未使用的代码，将减少输出文件体积；
原理是分析模块间的以来关系；

### Webpack 热更新（HMR）是如何实现？
启动HMR服务；
代码片段注入到应用程序中，这个模块执行热更新模块替换的逻辑；
webpack服务器监听系统中文件变化，然后用websocket或者http轮询通知客户端；
客户端接着请求更新的模块代码，把新代码注入到应用程序；
接收到新模块的代码，热更新运行时会替换或者添加新模块;
实现不刷新页面

### Webpack 打包中 Babel 插件是如何工作的？


### Webpack 和 vite 有什么相同点与不同点？