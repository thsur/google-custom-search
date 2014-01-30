'use strict';

// Alias to console.log()

var log = (function (console) {

    return (console && typeof console.log === "function") ?
           function () { console.log.apply(console, arguments); } : function () {};

})(window.console);

/*---------------------------

  Main

---------------------------*/

angular.module('site-main', [

  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ngRoute'
]);

angular.module('site-main').config(function ($routeProvider) {

  $routeProvider
    .when('/', {

        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
    })
    .otherwise({ redirectTo: '/' });
});

//angular.module('site-main').run(function($rootScope, User){});
