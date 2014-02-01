'use strict';

angular.module('site-main').controller('Nav', function ($scope, $route, Server, Hud) {

  $scope.nav = {};

  Server.get('/resource/nav', function (data) {

    if(data){

      $scope.nav = data;
    }

    Hud.push($scope.nav);

  });

  $scope.$on('$locationChangeSuccess', function(event) {

      //$route.current = lastRoute;
      //log($route);
  });


});
