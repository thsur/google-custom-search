'use strict';

angular.module('navigation').directive('nav', function (Nav, Routes) {

  return {

    restrict: 'A',
    scope: true,
    controller: function($scope, $element, $attrs) {

      var level = $element.data('level');

      if(!angular.isNumber(level)){

        level = 0;
      }

      $scope.config = {

        level: level
      };

      $scope.route = Routes.active;

      $scope.$watchCollection('route', function(){

        $scope.nav = Nav.getByLevel($scope.config.level);
      });

      $scope.isActive = function (id) {

        return Nav.isActive(id);
      };
    },
    link: function (scope, element, attrs) {} };
});
