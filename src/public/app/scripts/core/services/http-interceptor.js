'use strict;'

angular.module('httpInterceptor').factory('httpInterceptor', function ($q) {

  return {

    response: function (response) {

      log(response);
      return $q.when(response); // Wrap response as promise
    },

    responseError: function (response) {

      log(response, $q);

      return $q.reject(response);
    }
  };
});

angular.module('httpInterceptor').config(function ($httpProvider) {

  $httpProvider.interceptors.push('httpInterceptor');
});