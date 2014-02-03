'use strict';

// Alias to console.log()

var log = (function (console) {

    return (console && typeof console.log === "function") ?
           function () { console.log.apply(console, arguments); } : function () {};

})(window.console);

/*---------------------------

  Main

---------------------------*/

(function(){

  var debug = true;

  // Manage module dependencies

  var dependencies = {

    defaults: [

      'ngCookies',
      'ngResource',
      'ngSanitize',
      'ngRoute'
    ],

    init: function(){

      this.app = this.defaults.concat(['services']); // Bind submodules here
      return this;
    }

  }.init();

  // Submodules

  angular.module('services', []);

  // Main module

  angular.module('site-main', dependencies.app);

  // Setup, performed on module loading

  angular.module('site-main').config(function ($routeProvider) {

    $routeProvider
      .when('/', {

          templateUrl: 'views/main.html',
          controller: 'Main'
      })
      .when('/on-text', {

          templateUrl: 'views/on-text.html',
          controller: 'Main'
      })
      .otherwise({ redirectTo: '/' });

  });

  // Init, performed after module loading

  angular.module('site-main').run(function ($rootScope, Server, Nav, Hud) {

    if(!debug){

      log = function(){};

      if(console && typeof console.log === "function"){

        console.log = log;
      }

      Hud.off();
    }

    // Global config & registry

    $rootScope.appConfig = {};

    // Set server endpoint

    Server.init({ endpoint: 'connect.php' });

    // Load nav

    Server.get('/resource/nav', function (data) {

      if(data){

        Nav.init(data);
      }
    });
  });

}());
