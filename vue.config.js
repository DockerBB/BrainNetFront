const path = require('path')
module.exports = {
    baseUrl: '/bsci',
    outputDir: 'docs',
    lintOnSave: true,
    productionSourceMap: false,
    css: {
        sourceMap: false,
        modules: false,
        loaderOptions: {
            stylus: {
                // 全局引入stylus变量
                import: [path.resolve(__dirname, './src/assets/css') + '/*.styl']
            }
        }
    },
    devServer: {
        disableHostCheck: true,
        port: 8002
    }
}
