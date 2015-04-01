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
      'ngRoute',
      'ui.bootstrap',
      'ui.bootstrap.tpls'
    ],

    core: [

      'stdLib',
      'http',
      'routes',
      'navigation',
      'filters',
      'ui',
      'butterbar',
      'messages',
      'errors',
      'google'
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

  // Get routes as initial data.
  // We need to defer bootstrapping from here on onwards, which
  // is why we use a promise to get us a hook later on.

  var routes;
  var promise = jQuery.getJSON('connect.php/routes');

  // Setup, performed on module loading

  angular.module('app').config(function ($locationProvider, $routeProvider, RoutesProvider) {

    var core = {login: '/login', error: '/error'};

    // Don't append a '#' to urls
    //
    // Unless this issue get solved, we need to switch off html5mode:
    // @see https://github.com/angular/angular.js/issues/1388
    $locationProvider.html5Mode(false);

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

    if (routes) {

      RoutesProvider
            .named(core)
            .init(routes, 'Main'); // 'Main' being the default controller
    }
  });

  // Init, performed after module loading

  angular.module('app').run(function (Server, Nav) {

    if(!debug){

      log = function(){};

      if(console && typeof console.log === "function"){

        console.log = log;
      }
    }

    // Set server endpoint
    Server.init({ endpoint: 'connect.php' });

    // Load navigation(s)
    if (routes) {

      Nav.init(routes);
    }
  });

  // Bootstrap when ready
  promise.success(function (response) {

    routes = response;
    angular.bootstrap(document, ['app']);
  });
}());
