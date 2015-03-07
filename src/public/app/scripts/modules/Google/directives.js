
'use strict';

/**
 * @requires bootstrap.js
 */
angular.module('google').directive('googleTabs', function () {

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

      // Watch tabs. If a tab's data sets shrinks to zero,
      // switch to an appropriate alternative tab.

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

        scope.switchTab(switch_to); // Call x-ui-util's switchTab()
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
    }
  };
});

angular.module('google').directive('tags', function () {

  return {

    restrict: 'A',
    scope: true,
    link: function(scope, element, attrs) {

      var item = scope.item;
      var tag  = scope.tag;

      if (item.tags && item.tags[tag]) {

        element.addClass('active'); // ng-class won't work here due to a conflict with Bootstrap (both would set .active,
                                    // but at least one of them only seems to toggle it, resulting in an active element
                                    // turned inactive).
      }
    }
  };
});

angular.module('google').directive('autosave', function ($interval) {

  return {

    restrict: 'A',
    scope: true,
    link: function(scope, element, attrs) {

      var interval = 60 * 5 * 1000; // Autosave every 5 minutes

      if (!scope.autosave) {

        scope.autosave = $interval(function () {

          var buttons = $('button.save').button('loading');

          scope.save(function () {

            buttons.button('reset');
          });

        }, interval);

        scope.$on('$destroy', function () {

          $interval.cancel(scope.autosave);
        });
      }

      element.on('click', function () {

        var button = $(this).button('loading');

        scope.save(function () {

          button.button('reset');
        });
      });
    }
  };
});
