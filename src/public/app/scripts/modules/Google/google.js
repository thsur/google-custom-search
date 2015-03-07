'use strict';

angular.module('app').controller('Google', function ($scope, $interval, Server){

  $scope.query     = {q: ''};

  $scope.queries   = {};
  $scope.results   = {};
  $scope.tags      = {};

  $scope.collected = [];
  $scope.trash     = [];

  // Load saved searches

  Server
    .get('/search/google')
    .success(function(data, status) {

      $scope.queries = data;
    });

  // Load tags

  Server
    .get('/tags')
    .success(function(data, status) {

      $scope.tags = data;
    });

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
   * Loads a saved query
   *
   * @param  String   - hash identifying the query
   * @param  Function - callback
   * @param  Array    - arguments to pass into the callback
   */
  $scope.loadQuery = function (hash, callback, args) {

    $scope.results   = {};
    $scope.collected = [];
    $scope.trash     = [];

    Server
    .get('/search/google/get/' + hash)
    .success(function(data, status) {

      $scope.results   = angular.fromJson(data[0]);

      $scope.results.info  = angular.fromJson($scope.results.info);
      $scope.results.items = angular.fromJson($scope.results.items);

      _.each($scope.results.items, function (elem) {

        elem.tags = elem.tags || {};
      })

      if (angular.isFunction(callback)) {

        callback.call(null, args)
      }
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

  /**
   * Save all data sets.
   */

  $scope.save = function (callback) {

    var send = {

      hash: $scope.results.hash,
      results: $scope.results,
      collected: $scope.collected,
      trash: $scope.trash
    };

    log(send);

    $scope.$broadcast('app.pre-save');

    Server
    .get('/tags')
    .success(function(data, status) {

      if (angular.isFunction(callback)) {

        callback();
      }
    })
    .finally(function () {

      $scope.$broadcast('app.post-save');
    });
  };

  /**
   * Auto-save & on destroy
   */

  var interval = 60 * 5 * 1000; // Autosave every 5 minutes
  var autosave = $interval(function () {

    $scope.save();

  }, interval);

  $scope.$on('$destroy', function () {

    $interval.cancel(autosave);
    $scope.save();
  });
});
