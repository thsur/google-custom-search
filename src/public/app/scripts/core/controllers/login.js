'use strict';

angular.module('app').controller('Login', function ($scope, Server) {

  Server
    .post('/login', [])
    .then(function (response) {

      log(response);
    })
    .catch(function (response) {

      log(response);
    });
});
