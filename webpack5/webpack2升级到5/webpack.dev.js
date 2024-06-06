const { merge } = require('webpack-merge')
const baseWebpackConfig = require('./webpack.base.conf')

const devWebpackConfig = merge(baseWebpackConfig, {
    mode: 'development',
    output: {
        publicPath: '/'
      },
})

module.exports = devWebpackConfig