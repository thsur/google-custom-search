
var defaults = require('./karma.conf.js');
var proxies  = require('./karma.proxies.conf.js');

module.exports = function(config) {

  defaults(config, 'midway');

  config.frameworks = ['mocha'];
  config.autoWatch = true;

  config.proxies = {

    '/': proxies.base,
    '/test/': proxies.test
  };
};
