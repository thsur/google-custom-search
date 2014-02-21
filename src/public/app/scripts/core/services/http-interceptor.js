'use strict;'

angular.module('http').factory('HttpInterceptor', function ($q, $rootScope) {

  return {

    responseError: function (response) {

      $rootScope.$emit('HttpResponseError', response);
      return $q.reject(false);
    }
  };
});

angular.module('http').config(function ($httpProvider) {

  $httpProvider.interceptors.push('HttpInterceptor');
});
