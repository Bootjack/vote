const path = require('path')

module.exports = {
  entry: path.resolve(__dirname, 'handler.js'),
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'handler.js',
    libraryTarget: 'umd'
  },
  resolve: {
    extensions: ['', '.js', '.jsx']
  },
  target: 'node',
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        loader: 'babel',
        exclude: /node_modules/,
        query: { plugins: [] }
      },
      {
        test: /\.css$/,
        loader: 'style!css'
      }
    ]
  }
}
