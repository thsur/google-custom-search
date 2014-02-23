'use strict';

/**
 * App controller
 * Stub
 */
angular.module('app').controller('App', function ($rootScope, $scope, $route, $location, Errors) {

  // Dispatch country-wide events

  var subscriptions = [

    $rootScope.$on('HttpResponseError', function (event, response) {

      Errors.push(response);

      if (response.status === 401) {

        $location.path('/login');
        return;
      }

      if ($location.path() === '/error') {

        $route.reload();
        return;
      }

      $location.path('/error');
    }),

    $rootScope.$on('$routeChangeStart', function (event, current, prev) {

      if (current.redirectTo && current.redirectTo === '/error') {

        Errors.push({status: 404});
        $location.path('/error');
        return;
      }
    })
  ];

  // Unregister event bindings to prevent memory leaks.
  // @see http://odetocode.com/blogs/scott/archive/2013/07/16/angularjs-listening-for-destroy.aspx

  $scope.$on('$destroy', function(){

    angular.forEach(subscriptions, function(subscription) {

      subscription();
    });
  });
});
