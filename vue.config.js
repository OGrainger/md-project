const webpack = require('webpack')
const path = require('path')

module.exports = {
  publicPath: process.env.VUE_APP_BASE_URL,
  configureWebpack: {
    plugins: [
      new webpack.DefinePlugin({
        'process.env': {
          PACKAGE_JSON_VERSION: '"' + require('./package.json').version + '"'
        }
      })
    ],
    resolve: {
      modules: [path.resolve(__dirname, './src'), 'node_modules'],
      extensions: ['.js', '.jsx', '.json'],
      alias: {
        Root: path.resolve(__dirname, './src/'),
        Components: path.resolve(__dirname, './src/components/'),
        Utils: path.resolve(__dirname, './src/utils/'),
        Store: path.resolve(__dirname, './src/store/'),
        Enums: path.resolve(__dirname, './src/enums')
      }
    }
  }
}
