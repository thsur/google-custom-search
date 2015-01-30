'use strict';

/**
 * Server RPC module.
 *
 * Small wrapper around $http.
 *
 * @todo Refactor to a provider for more isolated configuration
 * @see  https://github.com/angular/angular.js/wiki/Understanding-Dependency-Injection
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
   * @param String   query     Most likely some path ('/get/something').
   *                           Gets prepended with {@see settings.endpoint}.
   * @param Object   config    Additional $http settings (optional).
   * @param Function callback  To mimic callback-like behaviour.
   *
   * @return Object  Promise   The one $http returns.
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
