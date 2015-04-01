'use strict';

angular.module('app').controller('Error', function ($scope, Errors) {

  var errors = Errors.getErrors();
  var last   = errors[errors.length - 1];

  if (!last) {

     last = {status: 400};
  }

  $scope.error = {

    code: last.status < 500 ? last.status : 'server error'
  };
});
