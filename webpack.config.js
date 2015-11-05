var path = require('path')
var ExtractTextWebpackPlugin = require('extract-text-webpack-plugin')

module.exports = {
  context: path.resolve(__dirname, './frontend'),
  entry: {
    javascript: path.resolve(__dirname, './frontend/javascripts/index.js'),
    stylesheet: path.resolve(__dirname, './frontend/stylesheets/index.scss')
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, './public')
  },
  module: {
    resolve: ['', '.js'],
    loaders: [
      {
        test: /\.js$/,
        include: /frontend/,
        loader: 'babel',
        query: {
          stage: '0',
          plugins: [
            path.resolve(__dirname, './frontend/babel-relay-plugin')
          ]
        }
      }, {
        test: /\.scss$/,
        include: /frontend/,
        loader: ExtractTextWebpackPlugin.extract('style', 'css!sass')
      }
    ]
  },
  plugins: [
    new ExtractTextWebpackPlugin('stylesheet.bundle.css', {
      allChunks:  true,
      extract:    true,
      remove:     true
    })
  ]
}
