'use strict';

/**
 * App controller
 * Stub
 */
angular.module('app').controller('App', function ($rootScope, $scope, $route, $location, Errors, Routes) {

  var paths = {

    login: Routes.getNamed('login'),
    error: Routes.getNamed('error'),
  };

  function internal404 () {

    Errors.push({status: 404});
    $location.path(paths.error);

  }

  // Dispatch country-wide events

  var subscriptions = [

    // Server errors

    $rootScope.$on('HttpResponseError', function (event, response) {

      Errors.push(response);

      if (response.status === 401) {

        if ($location.path() !== paths.login) {

          $location.path(paths.login);
        }

        return;
      }

      if ($location.path() === paths.error) {

        $route.reload();
        return;
      }

      $location.path(paths.error);
    }),

    // Routing errors

    $rootScope.$on('$routeChangeStart', function (event, current, prev) {

      if (!current) { internal404(); };
    }),

    $rootScope.$on('$locationChangeSuccess', function (event, current, prev) {

      if (!Routes.active.route) { internal404(); };
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
