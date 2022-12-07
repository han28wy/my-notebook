记录打包工具从webpack2.9.0升级到vite的历程：
项目：vue2.3+elementUI,vux,iview+webpack2.9.0
实施过程：
1 熟悉vite; 用vite3+vue2.7搭建框架,引入element,iview等本项目内容，先熟悉一波操作；
2 根据第一个原始框架，把核心东西放到老项目里，能npm run dev运行
3 解决报错，我记得有一些
深度选择器使用：deep();
requeire无法识别，修改图片和工具引入和export方式；
iview用<i- >这种形式无法识别；
使用jsx语法的有部分需要修改为直给的方式才能显示，出现于<Table ：colum;
4 去掉所有vux,替换成别的
4 element-ui自定义主题引入
打包部署之后的问题：
5 修复iview字体不显示问题
6 富文本编辑器


以下是步骤：
npm init vite 然后选择安装模板 viliana
修改main.js    App.vue目录
修改main.js为vue2新建文件的目录
安装yarn npm install yarn@latest -g ; 修改package.json的vue版本了 ； 然后 yarn install
安装vite里的vue2插件  npm install vite-plugin-vue2
新建vue.config.js文件
安装关于vue的依赖：npm install vue;   npm install vue-template-compiler@2.5.2

      const CompressionWebpackPlugin = require('compression-webpack-plugin')
      config.plugin('CompressionWebpackPlugin').use(
        new CompressionWebpackPlugin({
          filename: '[path].gz[query]',
          algorithm: 'gzip',
          threshold: 3000,
          test: new RegExp('\\.(' + ['js'].join('|') + ')$'),
          minRatio: 0.7
        })
      )

对项目operation的改造过程
1 npm install vite -S    npm init vite
2 替换vite.config.js,   修改package.json,   index.html新增App路径， 
npm install vite-plugin-compression 这是增加gzip压缩的
3 jsx语法转换   <script lang="jsx">
4 vite.config.js 配置 alias(解析@)  extensions
5 解决和babel相关的错误：Plugin/Preset files are not allowed to export objects, only functions.这是版本不统一 ， 删除babel相关的，再重新安装babel-loader@7
import legacy from '@vitejs/plugin-legacy'
这个好像是官方的能解决babel的
重装node-sass;   npm install @babel/parser    npm install @babel/core -g

6 关于修改iview  element-ui的官方样式的文件都无法读取
~这个表示是vue/cli里面默认的，统一换成node_modules/
然后会报一个calc(）的错误，需要降低sass版本

7 对于很多样式文件里的@import操作
import是引入js文件的租金啊
@import是引入.scss（预编译css文件格式内容）
ps:看一下import和export  默认这种情况

8 vite不能使用require引用的问题怎么解决 ？
npm install @types/node --save-dev  没有解决问题
掘金上面说有三种方案的：
1. 第一种是采用import/from来引入，这种方式适合图片和所有模块，也是最符合规范，利用tree-shrink的。
2. 第二种是直接把图片提前压缩处理后放在public文件下，就可以通过根路径/xxx.png来访问到了。
3. 第三种使用vite提供的import.meta.glob()方法，但该方法返回的是异步的，适合配置懒加载动态路由。

9怎么处理timers模块
项目中 import {setTimeout} from 'timers'都报错的； 发现是timers-browserify这个包不支持
然后把这个引用全都去掉就好了 ，但是我不能明白为什么不能直接用setTimeout

10 模块的改造
有很多module.export+require的改造成export+import
export和export default
import的几种方法：

11 环境错误的修改
setting.js 改成export default function setting()

在开发过程中看到的一些重点信息：
@vitejs/plugin-vue插件是对vue3语法做支持，如果要支持vue2，需要用vite-plugin-vue2
sass
babel 和 babel-loader 作用是把es5+后向兼容；
babelrc文件的作用： 是配置文件对preset和plugin（表示该用哪些插件）进行配置
babel-plugin-transform-runtime
##########################################################################################
关于element-ui   iview的样式问题无法引入的：
1 ~这样的路径换成node_modules的
2 vite.config.js添加css相关的配置
3 /deep/的处理：    :deep
关于require的问题
使用vite的transform插件解决了
webpack中用resolve.ensure实现按需加载

以下附上vite.config.js:
import vue from "@vitejs/plugin-vue2"
import viteCompression from "vite-plugin-compression";
import { defineConfig, loadEnv } from "vite";
import requireTransform from 'vite-plugin-require-transform'
import { resolve } from "path";
export default ({ command, mode }) => {

  const env = loadEnv(mode, process.cwd(), "");
  return defineConfig({
    define: {
      "process.env": process.env,
    },
    // 插件列表
    plugins: [
      vue(),
      viteCompression(),
      requireTransform({
        // fileRegex: /.js$|.vue$/
      }),
    ],
    css: {
      preprocessorOptions: {
        less: {
          javascriptEnabled: true,
        },
        scss: {
          // 两种方式都可以
          additionalData: '@import "@/assets/css/elementui.scss";'
        }
      },
    },
    // 别名
    resolve: {
      extensions: [".js", ".vue", ".json", ".less", "scss", "jsx"],
      alias: {
        vue$: "vue/dist/vue.esm.js", // 独立构建即能识别template
        "@": resolve("src"),
        '/KindEditor': '/public/KindEditor'
      },
    },
    externals: {
      KindEditor: "window.KindEditor",
    },
    // 强制预构建插件包
    optimizeDeps: {
      // include: ['axios'],
    },
    // 打包配置
    build: {
      target: "modules",
      outDir: env.VITE_API_OUTPUT,
      assetsDir: "assets", // 指定生成静态资源的存放路径
      minify: "terser", // 混淆器，terser构建后文件体积更小
      terserOptions: {
        compress: {
          drop_console: true,
          drop_debugger: true,
        },
      },
    },
    base: env.VITE_BASE_URL, //在 HTTP 请求中预留此文件夹，用于代理 Vite 作为子文件夹时使用。应该以 / 字符开始和结束。
    // 本地运行配置，及反向代理配置
    server: {
      open: true, // 在服务器启动时自动在浏览器中打开应用程序
      hms: true,
      port: env.VITE_PORT,
      proxy: {
        "/mock": {
          target: "http://127.0.0.1:1111",
          changeOrigin: true,
        },
      },
    },
  });
};


