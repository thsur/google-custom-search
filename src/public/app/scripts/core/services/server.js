'use strict';

angular.module('server').factory('Server', function ($http, stdLib) {

  var config = {

    endpoint: null
  };

  var Server = function(){

    this.guid   = stdLib.guid();
    this.errors = [];
  };

  var ext = Server.prototype = {};

  ext.url = function (query) {

    if (query.charAt(0) !== '/'){

      query = '/' + query;
    }

    return config.endpoint + query;
  }

  ext.get = function (query, callback) {

    var url = this.url(query);
    var callback = angular.isFunction(callback) ? callback : function(){};
    var _this = this;

    $http
      .get(url)
      .success(function (data, status, headers, config) {

        callback.apply(callback, arguments);
      })
      .error(function (data, status, headers, config) {

        _this.errors.push({ query: query, url: url, result: arguments });
        callback(false);
      });
  }

  ext.post = function (query, callback) {

    var url = this.url(query);
    var callback = angular.isFunction(callback) ? callback : function(){};
    var _this = this;

    $http
      .post(url)
      .success(function (data, status, headers, config) {

        callback.apply(callback, arguments);
      })
      .error(function (data, status, headers, config) {

        _this.errors.push({ query: query, url: url, result: arguments });
        log(_this.errors);
        callback(false);
      });
  }

  ext.errors = function () {

    return errors.length > 0 ? errors : false;
  }

  // Public API

  var server = new Server(); // Singleton for now

  return {

    get: function () { return server.get.apply(server, arguments); },
    post: function () { return server.post.apply(server, arguments); },
    errors: function () { return server.errors.apply(server, arguments); },

    init: function (user_config) {

      angular.extend(config, user_config);
    }
  };
});
