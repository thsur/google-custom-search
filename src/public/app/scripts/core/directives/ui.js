
'use strict';

/**
 * @requires bootstrap.js
 */
angular.module('ui').directive('uiUtils', function () {

  return {

    restrict: 'A',
    scope: true,
    link: function(scope, element, attrs) {

      scope.$root.$on('$viewContentLoaded', function () {});

      scope.switchTab = function (target) {

        if (jQuery().tab) { // Bootstrap tabs

          var tab = element.find('.tabpanel').find('a[role="tab"][data-target="' + target + '"]');
          tab.tab('show');
        }
      };
    }
  };
});

angular.module('ui').directive('formUtils', function () {

  return {

    restrict: 'A',
    scope: true,
    link: function(scope, element, attrs) {

      scope.focusField = function (query) {

        element.find(query).focus();
      };
    }
  };
});


