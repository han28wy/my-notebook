### 对node的理解
是一个JavaScript的yung语言运行环境，也就是说，node.js是运行在服务端的JavaScript，它为JavaScript提供了一些服务，比如文件管理，网络，数据库等。

执行npm run dev后，触发webpack构建过程，首先读取webpack.config.js配置文件，然后分析模块依赖，这个要从entry开始，最后形成一个模块的依赖图。然后根据这个依赖图，使用loader和plugin对模块进行处理。最后打包成对应文件。
这些加载器和插件都是基于Node.js开发的，所以用require引入这些。
