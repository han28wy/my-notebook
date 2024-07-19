'use strict'
const path = require('path')
const utils = require('./utils')
const config = require('../config')
const vueLoaderConfig = require('./vue-loader.conf')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { VueLoaderPlugin } = require('vue-loader')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const chalk = require('chalk')
const ProgressBarPlugin = require('progress-bar-webpack-plugin')

const environments = {
  dev: '', //开发内网环境
  test: '', //测试环境
  prod: '', //现网环境
}

function resolve(dir) {
  return path.join(__dirname, '..', dir)
}
const cssFinalLoader = process.env.WEBPACK_SERVE
  ? 'style-loader'
  : MiniCssExtractPlugin.loader

const webpackConfig = {
  context: path.resolve(__dirname, '../'),
  entry: './src/main.js',
  output: {
    path: config.build.assetsRoot,
    filename: 'js/[name].js',
  },
  externals: {},
  devServer: {
    hot: true,
    open: true,
    compress: true,
    client: {
      overlay: false, // 本地运行，有错误或者警告不覆盖全屏
    },
    proxy: [
      {
        context: ['/a', '/b'],
        target: environments[process.env.Node_ENV],
        changeOrigin: true,
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.vue', '.json', '.less'],
    alias: {
      vue$: 'vue/dist/vue.esm.js',
      '@': resolve('src'),
    },
    modules: ['node_modules'],
  },
  plugins: [
    new VueLoaderPlugin(),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: './index.html',
      inject: true,
    }),
    new ProgressBarPlugin({
      format: `  :msg [:bar] ${chalk.green.bold(':percent')} (:elapsed s)`
    })
  ],
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: vueLoaderConfig,
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: [
          resolve('src'),
          resolve('test'),
          resolve('node_modules/webpack-dev-server/client'),
        ],
      },
      {
        test: /\.svg/,
        type: 'asset/source'
      },
      {
        test: /\.(png|jpe?g|gif|webp)(\?.*)?$/,
        type: 'asset', // 在导出一个 data URI 和发送一个单独的文件之间自动选择
        generator: {
          filename: utils.assetsPath('img/[name].[hash:7][ext]'),
        },
        parser: {
          dataUrlCondition: {
            maxSize: 10 * 1024, // 超过10kb的进行复制，不超过则直接使用base64
          },
        },
      },
      // sass文件处理
      {
        test: /\.s[ca]ss$/,
        use: [
          cssFinalLoader,
          {
            loader: 'css-loader',
            options: {
              importLoaders: 2,
            },
          },
          'postcss-loader',
          'sass-loader',
        ],
      },
      // less文件处理
      {
        test: /\.less$/,
        use: [
          cssFinalLoader,
          {
            loader: 'css-loader',
            options: {
              importLoaders: 2,
            },
          },
          'postcss-loader',
          {
            loader: 'less-loader',
            options: {
              lessOptions: {
                javascriptEnabled: true,
              },
            },
          },
        ],
      },
      // css文件处理
      {
        test: /\.css$/,
        exclude: /node_moduels/,
        use: [
          cssFinalLoader,
          {
            loader: 'css-loader',
            options: {
              esModule: false, // css不使用esModule，直接输出
              importLoaders: 1, // 使用本loader前使用1个其他处理器
            },
          },
          'postcss-loader',
        ],
        sideEffects: true, // 希望保留副作用
      },
      {
        test: /\.(styl|stylus)$/,
        use: [
          'vue-style-loader',
          {
            loader: 'css-loader',
            options: {
              sourceMap: true,
            },
          },
          {
            loader: 'postcss-loader',
            options: {
              sourceMap: true,
            },
          },
          {
            loader: 'stylus-loader',
            options: {
              'resolve url': true,
              sourceMap: true,
            },
          },
        ],
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        type: 'asset/resource', // 指定静态资源类复制
        generator: {
          filename: utils.assetsPath('fonts/[name].[hash:7].[ext]'),
        },
      },
    ],
  },
}
module.exports = webpackConfig
