const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const HtmlWebpackPluginConfig = new HtmlWebpackPlugin({
  template: './src/index.html',
  filename: 'index.html',
  inject: 'body'
})


module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve('dist'),
    filename: 'bundle.js',
  },
  devServer: {
    compress: true,
    contentBase: [
      path.join(__dirname, 'dist'),
    ],
    historyApiFallback: true, // needed for any spa
    host: '0.0.0.0',
    port: 8081,
    watchContentBase: true,
    watchOptions: {
      poll: true,
    },
    // https://webpack.js.org/configuration/stats/
    stats: {
      children: false,
      hash: false,
      modules: false,
    },
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.jsx$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        loader: 'style-loader!css-loader',
      },
    ],
  },
  plugins: [
    HtmlWebpackPluginConfig,
  ],
  resolve: {
    alias: {
      components: path.resolve(__dirname, 'src/components'),
      constants: path.resolve(__dirname, 'src/constants'),
      services: path.resolve(__dirname, 'src/services'),
    }
  },
};
