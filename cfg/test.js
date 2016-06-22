var path = require('path');
var srcPath = path.join(__dirname, '/../src/');

// Add needed plugins here
var BowerWebpackPlugin = require('bower-webpack-plugin');

module.exports = {
  devtool: 'eval',
  module: {
    preLoaders: [
      {
        test: /\.(js|jsx)$/,
        loader: 'isparta-instrumenter-loader',
        include: [
          path.join(__dirname, '/../src')
        ]
      }
    ],
    loaders: [
      { include: /\.json$/, loaders: ["json-loader"] },
      {
        test: /\.(js|jsx)$/,
        loader: 'babel-loader',
        include: [
          path.join(__dirname, '/../src'),
          path.join(__dirname, '/../test')
        ]
      },
      //why did i need to copy these over from base??
      //need to provide the include also
      {
        test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: 'url-loader?limit=10000&minetype=application/font-woff',
        include: [
          path.join(__dirname, '/../src'),
          path.join(__dirname, '/../test')
        ]
       },

      {
        test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
         loader: 'file-loader',
         include: [
           path.join(__dirname, '/../src'),
           path.join(__dirname, '/../test')
         ]
        },

      {
        test:   /\.css$/,
        loader: "style-loader!css-loader!postcss-loader",
        include: [
          path.join(__dirname, '/../src'),
          path.join(__dirname, '/../test')
        ]
      },

      {
        test: /\.scss/,
        loader: 'style-loader!css-loader!postcss-loader!sass-loader?outputStyle=expanded',
        include: [
          path.join(__dirname, '/../src'),
          path.join(__dirname, '/../test')
        ]
      },

      {
        test: /\.(png|jpg|gif|woff|woff2)$/,
        loader: 'url-loader?limit=8192',
        include: [
          path.join(__dirname, '/../src'),
          path.join(__dirname, '/../test')
        ]
      }
]
  },
  resolve: {
    extensions: [ '', '.js', '.jsx' ],
    alias: {
      actions: srcPath + 'actions/',
      helpers: path.join(__dirname, '/../test/helpers'),
      components: srcPath + 'components/',
      sources: srcPath + 'sources/',
      stores: srcPath + 'stores/',
      //needed to add the loaders above for this to work
      styles: srcPath + 'styles/',
      config: srcPath + 'config/' + process.env.REACT_WEBPACK_ENV
    }
  },
  plugins: [
    new BowerWebpackPlugin({
      searchResolveModulesDirectories: false
    })
  ]
};
