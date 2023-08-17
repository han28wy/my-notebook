
### app.js文件找不到路径
打包后在index.html里生成app.js等的路径；但是出现404找不到路径的问题
```
output: {
  path: path.resolve(__dirname, 'dist'), // 输出目录
  filename: 'app.js', // 输出文件名称
  publicPath: '' // 公共路径
}
```
### 原项目里static的文件挪到外面
使用CopyWebpackPlugin插件
```
        new CopyWebpackPlugin([
            {
                from: path.resolve(__dirname, '../static'),
                to: config.build.assetsSubDirectory,
                ignore: ['.*']
            }
        ]),
```
### fonts，css, img, js文件挪到static里
使用url-loader
```
  {
                test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
                loader: 'url-loader',
                query: {
                    limit: 10000,
                    name: utils.assetsPath('img/[name].[hash:7].[ext]')
                }
            },
            {
                test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
                loader: 'url-loader',
                query: {
                    limit: 10000,
                    name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
                }
            }
```