'use strict'
const devConfig = require('./build/webpack.dev')
const prodConfig = require('./build/webpack.prod')

module.exports = (env) => {
    if(process.env.WEBPACK_SERVE) {
        return devConfig
    } else {
        return prodConfig()
    }
}