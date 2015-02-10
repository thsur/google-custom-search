'use strict';

angular.module('app').controller('Google', function ($scope, Server){

  var query     = {q: ''};

  var queries   = {};
  var results   = {};
  var tags      = {};

  var collected = [];
  var trash     = [];

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

  $scope.query     = query;

  $scope.queries   = queries;
  $scope.results   = results;
  $scope.tags      = tags;

  $scope.collected = collected;
  $scope.trash     = trash;

  /**
   * Adds a query snippet
   *
   * @param String
   */
  $scope.addSnippet = function (snippet) {

    query.q = query.q + ' ' + snippet;
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
});
