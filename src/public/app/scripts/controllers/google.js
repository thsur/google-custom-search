'use strict';

angular.module('app').controller('Google', function ($scope, Server){

  var query   = {q: ''};
  var queries = {};
  var results = null;

  Server
    .get('/search/google')
    .success(function(data, status) {

      $scope.queries = data;
    });

  $scope.query   = query;
  $scope.queries = queries;
  $scope.results = results;

  $scope.loadQuery = function (hash) {

    $scope.results = null;

    Server
    .get('/search/google/get/' + hash)
    .success(function(data, status) {

      $scope.results = angular.fromJson(data[0]);

      $scope.results.info    = angular.fromJson($scope.results.info);
      $scope.results.items   = angular.fromJson($scope.results.items);
    });
  };
});
