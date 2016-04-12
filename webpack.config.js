require('dotenv').load()

var path = require('path')
var autoprefixer = require('autoprefixer')
var ExtractTextWebpackPlugin = require('extract-text-webpack-plugin')
var webpack = require('webpack')

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
  resolve: {
    alias: {
      'components': path.resolve(__dirname, './frontend/javascripts/components'),
      'mutations': path.resolve(__dirname, './frontend/javascripts/mutations'),
    },
    extensions: ['', '.js', '.scss']
  },
  module: {
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
        loader: ExtractTextWebpackPlugin.extract('style', 'css!postcss!sass')
      }, {
        test: /\.(eot|woff|woff2|ttf|svg)(\?.*)?$/,
        include: /frontend/,
        loader: 'url'
      }
    ]
  },
  plugins: [
    new ExtractTextWebpackPlugin('stylesheet.bundle.css', {
      allChunks:  true,
      extract:    true,
      remove:     true
    }),
    new webpack.DefinePlugin({
      SAFARI_PUSH_ID: JSON.stringify(process.env.SAFARI_PUSH_ID),
      SAFARI_PUSH_URL: JSON.stringify(process.env.SAFARI_PUSH_URL)
    })
  ],
  postcss: () => {
    return [autoprefixer({ browsers: ['last 2 versions'] })]
  }
}
