const { merge } = require('webpack-merge')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const baseWebpackConfig = require('./webpack.base.conf')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')
const BundleAnalyzerPlugin =
  require('webpack-bundle-analyzer').BundleAnalyzerPlugin

module.exports = () =>
  merge(baseWebpackConfig, {
    mode: 'production',
    output: {
      publicPath: '/smart-kitchen/',
    },
    plugins: [
      new CleanWebpackPlugin(),
      new MiniCssExtractPlugin({
        // css单独拆分为文件
        filename: 'css/[name].[contenthash:9].css',
        ignoreOrder: true,
      }),
      // new BundleAnalyzerPlugin(),
    ],
    optimization: {
      runtimeChunk: true, //为运行时代码创建一个额外的 chunk，减少 entry chunk 体积
      splitChunks: {
        chunks: 'all',
        minSize: 10000,
        minRemainingSize: 0,
        minChunks: 1,
        maxAsyncRequests: 20,
        maxInitialRequests: 20,
        cacheGroups: {
          defaultVendors: {
            test: /[\\/]node_modules[\\/]/,
            priority: -10,
            reuseExistingChunk: true,
          },
          default: {
            minChunks: 2,
            priority: -20,
            reuseExistingChunk: true,
          },
          vant: {
            test: /[\\/]node_modules[\\/]vant[\\/]/,
            priority: 10,
            reuseExistingChunk: true,
            chunks: 'async',
          },
          vendors: {
            name: 'vendors',
            test: /[\\/]node_modules[\\/](vue|vue-router|vuex)[\\/]/,
            chunks: 'all',
            minSize: 0,
            priority: -10,
          },
        },
      },
      minimize: true,
      minimizer: [
        new TerserPlugin({
          terserOptions: {
            format: {
              comments: false, // 去掉所有注释
            },
            compress: {
              // drop_console: true, // 去掉所有console.log
              arrows: false,
              collapse_vars: false,
              comparisons: false,
              computed_props: false,
              hoist_funs: false,
              hoist_props: false,
              hoist_vars: false,
              inline: false,
              loops: false,
              negate_iife: false,
              properties: false,
              reduce_funcs: false,
              reduce_vars: false,
              switches: false,
              toplevel: false,
              typeofs: false,
              booleans: true,
              if_return: true,
              sequences: true,
              unused: true,
              conditionals: true,
              dead_code: true,
              evaluate: true,
            },
            mangle: {
              safari10: true,
            },
          },
          parallel: true,
          extractComments: false,
        }),
        new CssMinimizerPlugin(),
      ],
    },
  })
