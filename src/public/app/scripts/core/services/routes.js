'use strict;'

angular.module('routes').service('Routes', function ($rootScope, $location, $route) {

  var $routeProvider;

  var active = {};

  var setActiveRoute = function(){

      var path   = $location.path();
      var routes = $route.routes;

      var match;

      for(var route in routes){

        match = routes[route].regexp;

        if(match !== undefined && path.search(match) !== -1){

          active.route = routes[route].originalPath;
          return;
        }
      }
  };

  this.active = active;

  this.getRoutes = function () {

    return $route.routes;
  }

  this.init = function (routes, routeProvider, defaultController, otherwiseRoute) {

    if($routeProvider){

      return;
    }

    $routeProvider = routeProvider;

    // Set routes

    for(var i = 0, k = routes.length, route; i < k; i++ ){

      route = routes[i];

      if(route.hasOwnProperty('url')){

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

    // Trigger initial page load

    $route.reload();

    // Listen to routes

    setActiveRoute();

    $rootScope.$on('$locationChangeSuccess', function() {

      setActiveRoute();
    });
  };
});
