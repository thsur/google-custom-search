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

  this.init = function (routes, routeProvider, defaultController) {

    if($routeProvider){

      return;
    }

    $routeProvider = routeProvider;

    // Set routes

    for(var i = 0, k = routes.length, current; i < k; i++ ){

      current = routes[i];

      if(current.hasOwnProperty('url')){

        if(!current.url){

          current.url =  '/';
        }

        if(!current.controller){

          current.controller = defaultController;
        }

        $routeProvider.when(current.url, {

          templateUrl: current.view,
          controller: current.controller
        });

        // Make first route the default one

        if(i == 0){

          $routeProvider.otherwise({ redirectTo: current.url });
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
