
var defaultConfig = require('./karma.conf.js');
var baseUrl       = 'http://localhost:80/_rn.de/src/public/app/';
var testIndexUrl  = 'http://localhost:80/_rn.de/src/public/test/';

module.exports = function(config) {

  defaultConfig(config, 'midway');

  config.frameworks = ['mocha'];
  config.autoWatch = true;

  config.proxies = {

    '/': baseUrl,
    '/test/': testIndexUrl
  };
};
