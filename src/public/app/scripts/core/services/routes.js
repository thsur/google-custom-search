'use strict;'

angular.module('routes').provider('Routes', function ($routeProvider) {

  /**
   * Used to hold named/aliased routes, so we can refer to them
   * with their respective keyword across the system. Think of
   * special routes like error and login routes.
   */
  var namedRoutes = {};

  /**
   * Add named routes (see above) as an object with
   * each key representing the name/alias to the route that is
   * given as the key's value.
   */
  this.named = function (routes) {

    for (var name in routes) {

      if (angular.isString(routes[name])) {

        namedRoutes[name] = routes[name];
      }
    }

    return this;
  };

  this.init = function (routes, defaultController, otherwiseRoute) {

    // Parse & set routes

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
          controller: route.controller,
          redirectTo: route.redirect || null
        });

        // Set default route

        if(otherwiseRoute && otherwiseRoute === route.url){

          $routeProvider.otherwise({ redirectTo: route.url });
        }
      }
    }

    return this;
  };

  this.$get = function ($rootScope, $location, $route) {

    var active = {};

    var setActiveRoute = function () {

      var path   = $location.path();
      var routes = $route.routes;

      var match;

      for(var route in routes){

        match = routes[route].regexp;

        if(match !== undefined && path.search(match) !== -1){

          active.route = routes[route].originalPath;
          return;
        }
      };
    };

    $rootScope.$on('$locationChangeSuccess', function(event, route) {

      setActiveRoute();
    });

    setActiveRoute();

    return {

      active: active,
      getRoutes: function () {

        return $route.routes;
      },
      getNamed: function (name) {

        if (namedRoutes[name]) {

          return namedRoutes[name];
        }
      }
    };
  };
});
