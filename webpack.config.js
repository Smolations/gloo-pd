const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

const HtmlWebpackPluginConfig = new HtmlWebpackPlugin({
  template: './src/index.html.ejs',
  favicon: './src/favicon.ico',
  filename: 'index.html',
  inject: 'body'
})


module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve('dist'),
    filename: 'bundle.js',
  },
  devtool: 'source-map',
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
        exclude: /node_modules/,
        options: {
          // presets (babel-preset-env) being set in .babelrc
          cacheDirectory: true,
        },
      },
      {
        test: /\.jsx$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        options: {
          // presets (babel-preset-env) being set in .babelrc
          cacheDirectory: true,
        },
      },
      {
        test: /\.css$/,
        loader: 'style-loader!css-loader',
      },
    ],
  },
  plugins: [
    HtmlWebpackPluginConfig,
    // new BundleAnalyzerPlugin({
    //   analyzerPort: 8887,
    //   openAnalyzer: false,
    // }),
    // new UglifyJSPlugin(),
  ],
  resolve: {
    alias: {
      components: path.resolve(__dirname, 'src/components'),
      constants: path.resolve(__dirname, 'src/constants'),
      services: path.resolve(__dirname, 'src/services'),
    }
  },
};
