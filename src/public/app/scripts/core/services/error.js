'use strict';

angular.module('errors').factory('Errors', function () {

  var errors = [];

  return {

    push: function (error) {

      errors.push(error);
    },

    getErrors: function () {

      return errors;
    }
  };
});