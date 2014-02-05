'use strict;'

angular.module('services').service('Routes', function ($rootScope, $location, $route) {

  var $routeProvider;

  this.init = function (routes, routeProvider, defaultController) {

    if($routeProvider){

      return;
    }

    $routeProvider = routeProvider;

    for(var i = 0, k = routes.length, current; i < k; i++ ){

      current = routes[i];

      if(current.hasOwnProperty('url') && current.hasOwnProperty('view')){

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

    $route.reload();

    var getCurrentRoute = function(){

      var path   = $location.path();
      var routes = $route.routes;

      for(var route in routes){

        log(route, path.search(routes[route].regexp), routes[route].regexp);
        if(routes[route].regexp !== undefined && path.search(routes[route].regexp) !== -1){

          log('Hit:', routes[route].originalPath);
        }
      }

    };
    getCurrentRoute();
    $rootScope.$on('$locationChangeSuccess', function() {
   // Minimize the current widget and maximize the new one
    if($route.current){

      // Looks like the $$ properties in Angular are suggested to be private and we should not call them directly from our code.
      //var important = $route.curent.$$route.originalPath;
    }
    log(routes, $route.routes, $route, $location.path(), $location.url());
});
    log($location.path(), $location.url(), $route.routes);

  };

});
