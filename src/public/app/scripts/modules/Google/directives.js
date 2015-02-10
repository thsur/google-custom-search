
'use strict';

/**
 * @requires bootstrap.js
 */
angular.module('google').directive('google', function () {

  return {

    restrict: 'A',
    scope: true,
    link: function(scope, element, attrs) {

      // Auto-load a saved query and switch to results tab.
      // For testing purposes only.

      scope.$watch('queries', function (new_val, old_val) {

        if (scope.queries[0]) {

          scope.loadQuery(scope.queries[0].hash, scope.switchTab, [1]);
        }
      });

      // Watch collections for changes to switch tabs accordingly.

      var switch_tabs = function (from) {

        var switch_to = 0,
            name;

        var tabs = {results: 1, collected: 2, trash: 3};

        switch (from) {

          case 'results':
            name = scope.hasCollected() ? 'collected' : 'trash';
            break;

          case 'collected':
            name = scope.hasResults() ? 'results' : 'trash';
            break;

          case 'trash':
            name = scope.hasCollected() ? 'results' : 'collected';
            break;
        }

        if (name && _.size(scope[name])) {

          switch_to = tabs[name];
        }

        log(name, switch_to);

        scope.switchTab(switch_to);
      };

      var changedToEmpty = function (collection, new_val, old_val) {

          var empty       = _.size(collection) == 0;
          var changed     = (new_val !== old_val);

          return (empty && changed);
      };

      scope.$watchCollection('results.items', function (new_val, old_val) {

        if (changedToEmpty(scope.results.items, new_val, old_val)) {

          switch_tabs('results');
        }
      });

      scope.$watchCollection('collected', function (new_val, old_val) {

        if (changedToEmpty(scope.collected, new_val, old_val)) {

          switch_tabs('collected');
        }
      });

      scope.$watchCollection('trash', function (new_val, old_val) {

        if (changedToEmpty(scope.trash, new_val, old_val)) {

          switch_tabs('trash');
        }
      });

      /*
      scope.$watchCollection('collected', function (new_val, old_val) {

        var empty   = !scope.collected.length;
        var changed = (new_val !== old_val);

        if (changed && empty) {

          if (scope.hasResults()) {

            scope.switchTab(1);
          }
        }
      });
      */
    }
  };
});
