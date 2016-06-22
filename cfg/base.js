var path = require('path');

var autoprefixer = require('autoprefixer');
var precss       = require('precss');

var port = 8080;
var srcPath = path.join(__dirname, '/../src');
var publicPath = '/assets/';

module.exports = {
  node: {
  fs: "empty"
},
  port: port,
  debug: true,
  output: {
    path: path.join(__dirname, '/../dist/assets'),
    filename: 'app.js',
    publicPath: publicPath,
  },
  devServer: {
    contentBase: './src/',
    historyApiFallback: true,
    hot: true,
    port: port,
    publicPath: publicPath,
    noInfo: false
  },
  resolve: {
    extensions: ['', '.js', '.jsx', '.json'],
    alias: {
      actions: srcPath + '/actions/',
      components: srcPath + '/components/',
      sources: srcPath + '/sources/',
      stores: srcPath + '/stores/',
      styles: srcPath + '/styles/',
      config: srcPath + '/config/' + process.env.REACT_WEBPACK_ENV
    }
  },
  module: {
    preLoaders: [
      {
        test: /\.(js|jsx)$/,
        include: srcPath,
        loader: 'eslint-loader'
      }
    ],
    loaders: [

      { test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: 'url-loader?limit=10000&minetype=application/font-woff' },
      { test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: 'file-loader' },

      {
        test:   /\.css$/,
        loader: "style-loader!css-loader!postcss-loader"
      },

      {
        test: /\.scss/,
        loader: 'style-loader!css-loader!postcss-loader!sass-loader?outputStyle=expanded'
      },

      {
        test: /\.(png|jpg|gif|woff|woff2)$/,
        loader: 'url-loader?limit=8192'
      },

      { include: /\.json$/, loaders: ["json-loader"] }

    ]
  },

  postcss: function () {
            return [autoprefixer, precss];
    }
};
