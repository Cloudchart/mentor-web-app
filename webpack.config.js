require('dotenv').load()

var path = require('path')
var autoprefixer = require('autoprefixer')
var ExtractTextWebpackPlugin = require('extract-text-webpack-plugin')
var webpack = require('webpack')

module.exports = {
  context: path.resolve(__dirname, './frontend'),
  entry: {
    admin: path.resolve(__dirname, './frontend/javascripts/index-admin.js'),
    javascript: path.resolve(__dirname, './frontend/javascripts/index.js'),
    stylesheet: path.resolve(__dirname, './frontend/stylesheets/index.scss'),
    vendor: ['babel-polyfill']
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, './public')
  },
  resolve: {
    alias: {
      'admin': path.resolve(__dirname, './frontend/javascripts/admin'),
      'admin-components': path.resolve(__dirname, './frontend/javascripts/admin/components'),
      'admin-mutations': path.resolve(__dirname, './frontend/javascripts/admin/mutations'),
      'admin-routes': path.resolve(__dirname, './frontend/javascripts/admin/routes'),
      'components': path.resolve(__dirname, './frontend/javascripts/components'),
      'mutations':  path.resolve(__dirname, './frontend/javascripts/mutations'),
      'routes':     path.resolve(__dirname, './frontend/javascripts/routes'),
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
          presets: ['react', 'es2015', 'stage-0'],
          plugins: [
            "add-module-exports",
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
