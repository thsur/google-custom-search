
'use strict';

angular.module('ui').directive('formUtils', function () {

  return {

    restrict: 'A',
    scope: true,
    link: function(scope, element, attrs) {

      scope.focus = function (search) {

        element.closest('form').find(search).focus();
      };
    }
  };
});
