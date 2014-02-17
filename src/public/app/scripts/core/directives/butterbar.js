'use strict';

angular.module('butterbar').directive('butterbar', function ($rootScope) {

  return {

    restrict: 'E',
    link: function (scope, element, attrs) {

      $rootScope.$on('$routeChangeStart', function (event, next, current) {

          element.show();
      });
      $rootScope.$on('$routeChangeSuccess', function (event, next, current) {

          element.hide();
      });
      $rootScope.$on('$routeChangeError', function (event, next, current) {

          element.text('An error occured.');
      });
    }
  }
});