const path = require('path');

module.exports = {
  mode: 'development', // или 'production' при сборке
  entry: './assets/code/javascript/renderer/src/App.jsx',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'assets/code/html/dist')
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        }
      }
    ]
  },
  resolve: {
    extensions: ['.js', '.jsx']
  }
};
