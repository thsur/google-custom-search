'use strict';

angular.module('hud').directive('hud', function (Hud) {

  return {
    template: '<pre ng-repeat="message in info">{{message}}</pre>',
    restrict: 'E',
    scope: {},
    link: function (scope, element, attrs) {

      scope.info = Hud.fetchAll();
    }
  };
});
