import path from 'path';
import webpack from 'webpack';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
var CompressionPlugin = require("compression-webpack-plugin");

export default {
  devtool: 'cheap-module-eval-source-map',
  entry: {
    web : [
      "babel-polyfill",
      'webpack/hot/dev-server',
      'eventsource-polyfill',
      'webpack-hot-middleware/client?reload=true',
      './src/frontend/client' //entry point
    ]
  },
  target: 'web',
  output: {
    path: __dirname + '/src/static/scripts',
    publicPath: '/static/scripts/',
    filename: '[name]-bundle.js'
  },
  devServer: {
    hot: true,
    contentBase: './static/dist'
  },
  plugins: [
    new ExtractTextPlugin('[name]-bundle.js'),
    new webpack.LoaderOptionsPlugin({
      debug: true
    }),
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
    new webpack.optimize.UglifyJsPlugin({
      mangle: true,
      compress: {
        warnings: false, // Suppress uglification warnings
        pure_getters: true,
        unsafe: true,
        unsafe_comps: true,
        screw_ie8: true
      },
      output: {
        comments: false,
      },
      exclude: [/\.min\.js$/gi] // skip pre-minified libs
    }),
    new CompressionPlugin({
      asset: "[path].gz[query]",
      algorithm: "gzip",
      test: /\.(js|jsx)$|\.css$|\.html$/
    }),
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.HotModuleReplacementPlugin(),
  ],
  module: {
    rules: [{
      test: /\.(js|jsx)$/,
      include: path.join(__dirname, 'src/frontend'),
      loaders: ['babel-loader']
    }, {
      test: /(\.css)$/,
      loader: ExtractTextPlugin.extract('css?sourceMap')
    },
      {
        test: /\.json$/,
        loader: 'json-loader'
      }],

    noParse: [
      /src\/static\/scripts\/xregexp-all.min.js/
    ]
  }
};

