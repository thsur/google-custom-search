'use strict;'

angular.module('routes').provider('Routes', function ($routeProvider) {

  this.init = function (routes, defaultController, otherwiseRoute) {

    // Set routes

    for(var i = 0, k = routes.length, route; i < k; i++ ){

      route = routes[i];

      if(route.hasOwnProperty('url')){
log('init', route);
        if(!route.url){

          route.url =  '/';
        }

        if(!route.controller){

          route.controller = defaultController;
        }

        $routeProvider.when(route.url, {

          templateUrl: route.view,
          controller: route.controller
        });

        // Set default route

        if(otherwiseRoute && otherwiseRoute === route.url){

          $routeProvider.otherwise({ redirectTo: route.url });
        }
      }
    }
  };

  this.$get = function ($rootScope, $location, $route) {

    var active = {};

    var setActiveRoute = function () {

      var path   = $location.path();
      var routes = $route.routes;

      var match;

      log($route.routes, path);

      for(var route in routes){

        match = routes[route].regexp;

        log(route);

        if(match !== undefined && path.search(match) !== -1){

          active.route = routes[route].originalPath;
          return;
        }
      }
    };

    $rootScope.$on('$locationChangeSuccess', function(event, route) {

      setActiveRoute();
    });

    setActiveRoute();

    //$route.reload();

    return {

      active: active,
      getRoutes: function () {

        return $route.routes;
      }
    };
  };
});
