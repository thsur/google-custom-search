'use strict';

angular.module('navigation').directive('nav', function (Nav, Routes) {

  return {

    restrict: 'A',
    scope: true,
    controller: function($scope, $element, $attrs) {

      $scope.route = Routes.active;

      $scope.$watchCollection('route', function(){

        $scope.nav = Nav.get();
      });

      $scope.isActive = function (url) {

        return Nav.isActive(url);
      };
    },
    link: function (scope, element, attrs) {} };
});
