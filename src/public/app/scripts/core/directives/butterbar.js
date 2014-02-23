'use strict';

angular.module('butterbar').directive('butterbar', function ($rootScope) {

  return {

    restrict: 'E',
    link: function (scope, element, attrs) {

      $rootScope.$on('$routeChangeStart', function (event, current, prev) {

          element.show();
      });
      $rootScope.$on('$routeChangeSuccess', function (event, current, prev) {

          element.hide();
      });
      $rootScope.$on('$routeChangeError', function (event, current, prev) {

          element.hide();
      });
    }
  }
});