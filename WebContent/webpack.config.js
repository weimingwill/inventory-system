var path = require('path');
// var utils = require('./utils')
// var config = require('../config')
var HtmlWebpackPlugin = require('html-webpack-plugin');
var vueLoaderConfig = require('./build/vue-loader.conf.js');
var LodashModuleReplacementPlugin = require('lodash-webpack-plugin');
var webpack = require('webpack');

function resolve (dir) {
  return path.join(__dirname, '..', dir)
}

module.exports = {
  entry: {
    app: './src/main.js',
    // vendors: [
    //   "vue",
    //   "vue-router",
    //   "vuex",
    //   "vuex-router-sync"
    // ]
  },
  output: {
    path: path.resolve(__dirname, ''),
    filename: 'js/app.js'
  },
  resolve: {
    extensions: ['.js', '.vue', '.json'],
    // root: [path.resolve(__dirname, 'semantic-ui/dist')],
    alias: {
      'vue$': 'vue/dist/vue.esm.js',
      '@': resolve('src'),
      assets: path.resolve(__dirname, 'src/assets'),
      components: path.resolve(__dirname, 'src/components'),
      views: path.resolve(__dirname, 'src/views'),
      'vuex-store': path.resolve(__dirname, 'src/store'),
      // semantic: path.resolve(__dirname, 'css/semantic.css')
    }
  },
  devtool: 'eval-source-map',
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          { loader: "style-loader" },
          { loader: "css-loader" },
        ],
      },
      {
        test: /\.styl$/,
        use: [
          {loader: 'style-loader'},
          {loader: 'css-loader'},
          {loader: 'stylus-loader'},
          {loader: "sass-loader"}
        ]
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: vueLoaderConfig
      },
      // {
      //   test: /\.js$/,
      //   loader: 'babel-loader',
      //   include: [resolve('src'), resolve('test')]
      // },
      {
        test: /\.js$/,
        // use: ['vue-hot-reload-loader', 'buble-loader'],
        use: [
          {loader: 'vue-hot-reload-loader'},
          {
            loader: 'buble-loader',
            options: {
              'plugins': ['lodash'],
              objectAssign: 'Object.assign'
            }
          }
        ],
        exclude: /node_modules/,
        include: resolve('src'),
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          // name: utils.assetsPath('img/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          // name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.csv$/,
        loader: 'dsv-loader'
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'src/index.html',
      inject: true
    }),
    new LodashModuleReplacementPlugin({
      'collections': true,
      'paths': true
    }),
    new webpack.optimize.UglifyJsPlugin
    // new webpack.ProvidePlugin({
    //   $: 'jquery',
    //   jQuery: 'jquery'
    // })
  ]
};
