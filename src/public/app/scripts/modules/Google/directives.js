
'use strict';

/**
 * @requires bootstrap.js
 */
angular.module('google').directive('google', function () {

  return {

    restrict: 'A',
    scope: true,
    link: function(scope, element, attrs) {

      scope.$watch('queries', function (new_val, old_val) {

        if (scope.queries[0]) {

          scope.loadQuery(scope.queries[0].hash, scope.switchTab, [1]);
        }
      });
    }
  };
});
