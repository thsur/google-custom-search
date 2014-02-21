'use strict';

/**
 * Server module, though the name is slightly misleading:
 * It's meant to talk to server, not being one.
 *
 * More or less a small wrapper around $http.
 * See usage example below.
 */

/*

// Configure

Server.init({ endpoint: 'connect.php' });

// Promise or callback

Server
  .get('/get/something')
  .then(function (response) {

    console.log('success', response);

  }, function (response) {

    console.log('error', response);
  });

Server.get('/get/something', function (response) {

  console.log('success only', response);
});

*/

angular.module('http').factory('Server', function ($http) {

  var settings = {

    // Server-side API endpoint
    endpoint: '',

    // $http default configuration settings
    xhr: {}
  };

  var Server = function(){};

  var ext = Server.prototype = {};

  /**
   * Build an url.
   */

  ext.url = function (query) {

    if (query.charAt(0) !== '/') {

      query = '/' + query;
    }

    return settings.endpoint + query;
  };

  /**
   * Issue a request.
   *
   * @param {String}   query    - Most likely some path ('/get/something').
   *                              Gets prepended with {@see settings.endpoint}.
   * @param {Object}   config   - additional $http settings (optional)
   * @param {Function} callback - to mimic callback-like behaviour
   */

  ext.xhr = function (query, config, callback) {

    angular.extend(

      config,
      settings.xhr,
      {url: this.url(query)}
    );

    if (angular.isFunction(callback)) {

      return $http(config).then(callback);
    }

    return $http(config);
  };

  // Shortcut methods.

  ext.get = function (query, callback) {

    return this.xhr(query, {method: 'GET'}, callback);
  };

  ext.post = function (query, data, callback) {

    return this.xhr(query, {method: 'POST', data: data}, callback);
  };

  // Public API

  var server = new Server();

  return {

    get: function () { return server.get.apply(server, arguments); },
    post: function () { return server.post.apply(server, arguments); },
    init: function (config) { angular.extend(settings, config); }
  };
});
