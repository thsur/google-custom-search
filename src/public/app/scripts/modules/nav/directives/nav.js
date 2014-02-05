'use strict';

angular.module('navigation').directive('nav', function (Nav) {

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
      $scope.isActive = function (num) {

        return num === Nav.getActive($scope.config.level);
      };
      $scope.setActive = function (num) {

        Nav.setActive($scope.config.level, num);
      };
    },
    link: function (scope, element, attrs) {

      scope.rootline = Nav.rootline;
      scope.$watchCollection('rootline', function(rootline){

        log(rootline, Nav.getBranch(scope.config.level), scope.config.level);
        scope.tree = Nav.getBranch(scope.config.level);
      });
    }
  };
});
