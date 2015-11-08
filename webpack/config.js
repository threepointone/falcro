var path = require('path');
var webpack = require('webpack');

module.exports = {
  devtool: 'source-map',
  entry: {
    counter: ['webpack-hot-middleware/client','./examples/counter/app'],
    ajax: ['webpack-hot-middleware/client','./examples/ajax/app']
  },
  output: {
    path: path.join(__dirname, '../examples'),
    filename: '[name]/bundle.js',
    publicPath: '/examples'
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin()
  ],
  module: {
    loaders: [{
      test: /\.js$/,
      loaders: ['babel'],
      include: [path.join(__dirname, '../examples'), path.join(__dirname, '../src')]
    }]
  }
};
