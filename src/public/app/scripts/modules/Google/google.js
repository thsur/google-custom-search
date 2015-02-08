'use strict';

angular.module('app').controller('Google', function ($scope, Server){

  var query   = {q: ''};
  var queries = {};

  var results   = null;
  var collected = null;

  Server
    .get('/search/google')
    .success(function(data, status) {

      $scope.queries = data;
    });

  // API

  $scope.query     = query;
  $scope.queries   = queries;

  $scope.results   = results;
  $scope.collected = collected;

  $scope.addSnippet = function (snippet) {

    query.q = query.q + ' ' + snippet;
  };

  $scope.loadQuery = function (hash, callback, args) {

    $scope.results = null;

    Server
    .get('/search/google/get/' + hash)
    .success(function(data, status) {

      $scope.results   = angular.fromJson(data[0]);
      $scope.collected = [];

      $scope.results.info  = angular.fromJson($scope.results.info);
      $scope.results.items = angular.fromJson($scope.results.items);
      $scope.results.count = $scope.results.items.length;

      if (angular.isFunction(callback)) {

        callback.call(null, args)
      }
    });
  };

  $scope.collectQueryItem = function (key, item) {

    $scope.collected.unshift(item);
    $scope.results.items.splice(key, 1);
  };

  $scope.deleteQueryItem = function (key,item) {

    $scope.results.items.splice(key, 1);
  };

  $scope.removeCollectedItem = function (key,item) {

    $scope.results.items.unshift(item);
    $scope.collected.splice(key, 1);
  };
});
