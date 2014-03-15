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

    core: [

      'stdLib',
      'http',
      'routes',
      'navigation',
      'butterbar',
      'hud',
      'messages',
      'errors'
    ],

    navigation: ['routes'],

    init: function () {

      // Load submodules
      this.load(this.core);

      // Build core dependencies
      this.core = this.defaults.concat(this.core);
      return this;
    },

    load: function (modules) {

      var dependencies = [];

      for(var i = 0; i < modules.length; i++){

        if(this.hasOwnProperty(modules[i])){

          dependencies = this[modules[i]];
        }

        angular.module(modules[i], dependencies);
      }
    }

  }.init();

  // Main module

  angular.module('app', dependencies.core);

  // Get initial data.
  // We need to defer bootstrapping from here on onwards which
  // is why we use a promise to get us a hook later on.

  var config;
  var promise = jQuery.getJSON('connect.php/public-config');

  // Setup, performed on module loading

  angular.module('app').config(function ($routeProvider, RoutesProvider) {

    var core = {login: '/login', error: '/error'};

    // Add core routes

    $routeProvider
      .when(core.login, {

        controller: 'Login',
        templateUrl: 'views/partials/login.html'
      })
      .when(core.error, {

        templateUrl: 'views/partials/error.html',
        controller: 'Error'
      });

    // Add custom routes

    if (config.routes) {

      RoutesProvider
            .named(core)
            .init(config.routes, 'Main'); // 'Main' being the default controller
    }
  });

  // Init, performed after module loading

  angular.module('app').run(function (Server, Nav, Hud) {

    if(!debug){

      log = function(){};

      if(console && typeof console.log === "function"){

        console.log = log;
      }

      Hud.off();
    }

    // Set server endpoint
    Server.init({ endpoint: 'connect.php' });

    // Load navigation(s)
    if (config.pages) {

      Nav.init(config.pages);
    }
  });

  // Bootstrap when ready
  promise.success(function (response) {

    config = response;
    angular.bootstrap(document, ['app']);
  });
}());
