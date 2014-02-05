'use strict';

angular.module('butterbar').directive('butterbar', function ($rootScope) {

  return {

    restrict: 'E',
    link: function (scope, element, attrs) {

      $rootScope.$on('$routeChangeStart', function() {

          element.show();
      });
      $rootScope.$on('$routeChangeSuccess', function() {

          element.hide();
      });
      $rootScope.$on('$routeChangeError', function() {});
    }
  }
});