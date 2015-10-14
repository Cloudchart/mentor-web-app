var path = require('path')

module.exports = {
  context: path.resolve(__dirname, './frontend'),
  entry: {
    javascript: path.resolve(__dirname, './frontend/javascripts/index.js'),
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, './public/javascripts')
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
      }
    ]
  }
}
