var webpackCfg = require('./webpack.config');

module.exports = function(config) {
  config.set({
    basePath: '',
    browsers: [ 'PhantomJS', 'Chrome' ],
    files: [
      'test/loadtests.js'
    ],
    port: 8081,
    captureTimeout: 60000,
    frameworks: [ 'phantomjs-shim', 'mocha', 'chai' ],
    client: {
      mocha: {}
    },
    singleRun: false,
    reporters: [ 'mocha', 'coverage' ],
    preprocessors: {
      'test/loadtests.js': [ 'webpack', 'sourcemap' ]
    },
    webpack: webpackCfg,
    webpackServer: {
      noInfo: true
    },
    coverageReporter: {
      dir: 'coverage/',
      reporters: [
        { type: 'html' },
        { type: 'text' }
      ]
    }
  });
};
