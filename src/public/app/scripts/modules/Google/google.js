'use strict';

angular.module('app').controller('Google', function ($scope, $interval, $modal, Server){

  $scope.query     = {q: ''};

  $scope.queries   = {};
  $scope.tags      = {};

  $scope.results   = {};
  $scope.collected = [];
  $scope.trash     = [];

  // Autosave

  var interval = 60 * 5 * 1000; // Autosave every 5 minutes
  var autosave;

  $scope.$on('$destroy', function () {

    if (autosave) {

      $interval.cancel(autosave);
    }

    $scope.save();
  });

  // Load saved searches

  Server
    .get('/search/all')
    .success(function(data, status) {

      $scope.queries = data;
    });

  // Load tags

  Server
    .get('/tags')
    .success(function(data, status) {

      $scope.tags = data;
    });

  /**
   * Init scope variables with remote data.
   *
   * @param  Array
   * @param  Function - callback
   * @param  Array    - arguments to pass into the callback
   */
  var init = function (data, callback, args) {

    $scope.$broadcast('app.stop.watchSets');

    if (autosave) {

      $interval.cancel(autosave);
    }

    if ($scope.hasSets()) {

      $scope.save();
    }

    $scope.results       = angular.fromJson(data[0]);
    $scope.results.info  = angular.fromJson($scope.results.info);

    $scope.results.items = angular.fromJson($scope.results.items);
    $scope.collected     = angular.fromJson($scope.results.collected) || [];
    $scope.trash         = angular.fromJson($scope.results.trash)     || [];

    // Make sure items are taggable

    _.each($scope.results.items, function (elem) {

      elem.tags = elem.tags || {};
    });

    // Init autosave

    autosave = $interval(function () {

      $scope.save();

    }, interval);

    // Notify listeners

    if (angular.isFunction(callback)) {

      callback.apply(null, args)
    }

    $scope.$broadcast('app.start.watchSets');
  };

  var clear = function () {

    $scope.results   = {};
    $scope.collected = [];
    $scope.trash     = [];
    $scope.query     = {q: ''};
  };

  // API

  /**
   * Adds a query snippet
   *
   * @param String
   */
  $scope.addSnippet = function (snippet) {

    $scope.query.q = $scope.query.q + ' ' + snippet;
  };

  /**
   * Inits a Google search
   *
   * @param  Function - callback
   * @param  Array    - arguments to pass into the callback
   */
  $scope.initSearch = function (callback, args) {

    var query = $scope.query.q.trim();

    // Check if query already exists

    for (var i = 0; i < $scope.queries.length; i++) {

      if ($scope.queries[i].query === query) {

        return $scope.loadQuery($scope.queries[i], callback, args);
      }
    }

    // Otherwise init a new search

    $scope.$broadcast('app.pre.search');

    Server
    .post('/search/google', {query: query})
    .success(function(data, status) {

      init(data, callback, args);

      // Add query to list of saved queries
      $scope.queries.push({query: $scope.results.query, hash: $scope.results.hash});

      $scope.$broadcast('app.post.search');
    });
  };

  /**
   * Loads a saved query
   *
   * @param  Object   - query
   * @param  Function - callback
   * @param  Array    - arguments to pass into the callback
   */
  $scope.loadQuery = function (query, callback, args) {

    var hash       = query.hash;
    $scope.query.q = query.query;

    $scope.$broadcast('app.pre.search');

    Server
    .get('/search/' + hash)
    .success(function(data, status) {

      init(data, callback, args);
      $scope.$broadcast('app.post.search');

    });
  };

  /**
   * Deletes a saved query
   *
   * @param  Object   - query
   * @param  Function - callback
   * @param  Array    - arguments to pass into the callback
   */
  $scope.deleteQuery = function (query, callback, args) {

    var hash      = query.hash;
    var isCurrent = $scope.results.hash && $scope.results.hash == hash;

    // Confirm delete

    $modal
      .open({templateUrl: 'confirm-delete.html'})
      .result
      .then(function () {

        Server
          .get('/search/delete/' + hash)
          .success(function(data, status) {

            if (isCurrent) {

              clear();
            }

            // Remove query from list of saved queries
            $scope.queries = _.reject($scope.queries, function (query) { return query.hash == hash; })

            if (angular.isFunction(callback)) {

              callback.apply(null, args)
            }
          });
        },
        function () { return; },
        this
      );
  };

  /**
   * Save all data sets.
   */
  $scope.save = function (callback) {

    var send = angular.extend(

      {},
      $scope.results,
      {collected: $scope.collected, trash: $scope.trash}
    );

    angular.forEach(send, function (value, key) {

      if (angular.isArray(value) || angular.isObject(value)) {

        send[key] = angular.toJson(value);
      }
    });

    $scope.$broadcast('app.pre.save');

    Server
    .post('/search/update', send)
    .success(function(data, status) {

      if (angular.isFunction(callback)) {

        callback();
      }
    })
    .finally(function () {

      $scope.$broadcast('app.post.save');
    });
  };

  /**
   * Get result items.
   *
   * @return Array
   */
  $scope.getResults = function () {

    return $scope.results.items;
  };

  /**
   * Move an item from the results set
   * to the collected items set.
   *
   * @param  Integer - item position within results
   * @param  Object  - item to collect
   */
  $scope.collectQueryItem = function (key, item) {

    $scope.collected.unshift(item);
    $scope.results.items.splice(key, 1);
  };

  /**
   * Move an collected item back to results.
   *
   * @param  Integer - item position within collected items set
   * @param  Object  - item to move back
   */
  $scope.removeCollectedItem = function (key,item) {

    $scope.results.items.unshift(item);
    $scope.collected.splice(key, 1);
  };

  /**
   * Move an item from the results set to the trash.
   *
   * @param  Integer - item position within results
   * @param  Object  - item to trash
   */
  $scope.deleteQueryItem = function (key,item) {

    $scope.trash.unshift(item);
    $scope.results.items.splice(key, 1);
  };

  /**
   * Move an item from the trash back to results.
   *
   * @param  Integer - item position within trash
   * @param  Object  - item to trash
   */
  $scope.restoreQueryItem = function (key,item) {

    $scope.results.items.unshift(item);
    $scope.trash.splice(key, 1);
  };

  /**
   * Empty trash.
   */
  $scope.emptyTrash = function () {

    $scope.trash = [];
  };

  /**
   * Whether or not there are currently
   * any entries in the result items
   * array (which is meant to change by
   * user interaction).
   *
   * @return Boolean
   */
  $scope.hasResults = function () {

    return !!$scope.results.items && !!$scope.results.items.length;
  };

  $scope.hasCollected = function () {

    return !!$scope.collected.length;
  };

  $scope.hasTrash = function () {

    return !!$scope.trash.length;
  };

  $scope.hasSets = function () {

    return !!$scope.results.hash; // If it has a hash, it also has one of the above sets.
  };

  /**
   * Add or remove a tag to or from a collected item
   */
  $scope.toggleTag = function (key, tag) {

    var item = $scope.collected[key];

    item.tags      = item.tags || {};
    item.tags[tag] = item.tags[tag] ? false : true;

    if (!item.tags[tag]) {

      delete item.tags[tag];
    }
  };
});
