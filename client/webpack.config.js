const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const DotEnvPlugin = require('dotenv-webpack');

module.exports = {
  context: path.resolve(__dirname),
  devtool: 'source-map',
  entry: path.resolve(__dirname, 'src/index.js'),
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'index.js'
  },
  plugins: [
    new CopyWebpackPlugin([{
      from: {glob: '*.html'}
    }]),
    new DotEnvPlugin({
      path: path.resolve(__dirname, '../.env')
    })
  ],
  resolve: {
    extensions: ['.js', '.jsx'],
    modules: ['src', 'node_modules']
  },
  target: 'web',
  module: {
    loaders: [{
      test: /\.css$/,
      loader: 'style!css'
    }, {
      test: /\.json/,
      loader: 'json-loader'
    }, {
      test: /\.jsx?$/,
      loader: 'babel-loader',
      exclude: /node_modules/
    }]
  }
};
