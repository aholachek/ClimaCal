var webpackCfg = require('./webpack.config');

module.exports = function(config) {
  config.set({
    basePath: '',
    browsers: [ 'PhantomJS'],
    files: [
      'test/loadtests.js'
    ],
    port: 8081,
    captureTimeout: 60000,
    frameworks: [ 'phantomjs-shim', 'mocha', 'chai', 'sinon' ],
    client: {
      mocha: {
        reporter : 'html',
        ui : 'bdd'
      }
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
