
'use strict';

/**
 * @requires bootstrap.js
 */
angular.module('google').directive('googleTabs', function () {

  return {

    restrict: 'A',
    scope: true,
    link: function(scope, element, attrs) {

      // Switch to a tab
      //
      // Figures out what tab to switch to by looking at the given tab.

      var switch_tabs_from = function (tab) {

        var tabs = {

          search: '#search', results: '#items', collected: '#collected', trash: '#trash'
        };

        var initial = tabs.search;
        var switch_to;

        switch (tab) {

          case 'search':
            if (scope.hasResults()) {

              switch_to = 'results';

            } else if (scope.hasCollected()) {

              switch_to = 'collected';

            } else if (scope.hasTrash()) {

              switch_to = 'trash';
            }
            break;

          case 'results':
            switch_to = scope.hasCollected() ? 'collected' : (scope.hasTrash() ? 'trash' : null);
            break;

          case 'collected':
            switch_to = scope.hasResults() ? 'results' : (scope.hasTrash() ? 'trash' : null);
            break;

          case 'trash':
            switch_to = scope.hasResults() ? 'results' : (scope.hasCollected() ? 'collected' : null);
            break;
        }

        switch_to = switch_to ? tabs[switch_to] : initial;

        scope.switchTab(switch_to); // Call x-ui-util's switchTab()
      };

      var isEmpty = function (collection) {

        return _.size(collection) == 0;
      };

      var changedToEmpty = function (collection, new_val, old_val) {

          var empty   = isEmpty(collection);
          var changed = (new_val !== old_val);

          return (empty && changed);
      };

      // Watch tabs. If a tab's data set shrinks to zero,
      // switch to an appropriate alternative tab.

      var watch = function () {

        var watchers = [];

        watchers.push(scope.$watchCollection('results.items', function (new_val, old_val) {

          if (changedToEmpty(scope.results.items, new_val, old_val)) {

            switch_tabs_from('results');
          }
        }));

        watchers.push(scope.$watchCollection('collected', function (new_val, old_val) {

          if (changedToEmpty(scope.collected, new_val, old_val)) {

            switch_tabs_from('collected');
          }
        }));

        watchers.push(scope.$watchCollection('trash', function (new_val, old_val) {

          if (changedToEmpty(scope.trash, new_val, old_val)) {

            switch_tabs_from('trash');
          }
        }));

        return watchers;
      };

      var watchers;

      scope.$on('app.start.watchSets', function () {

        if (!watchers) watchers = watch(); // Start watchers

        switch_tabs_from('search');
      });

      scope.$on('app.stop.watchSets', function () {

        if (watchers) {

          for (var i = 0; i < watchers.length; i++) { // Stop watchers

            watchers[i]();
          }

          watchers = null;
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

      var buttons;

      scope.$on('app.pre.save', function () {

        buttons = $('button.save').button('loading');
      });

      scope.$on('app.post.save', function () {

        if (buttons) buttons.button('reset');
      });

      element.on('click', function () {

        scope.save();
      });
    }
  };
});

angular.module('google').directive('search', function ($interval) {

  return {

    restrict: 'A',
    scope: true,
    link: function(scope, element, attrs) {

      var button;

      scope.$on('app.pre.search', function () {

        button = $('input.btn.search').button('loading');
      });

      scope.$on('app.post.search', function () {

        if (button) button.button('reset');
      });
    }
  };
});