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
      'server',
      'routes',
      'navigation',
      'butterbar',
      'hud',
      'httpInterceptor'
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

  angular.module('site-main', dependencies.core);

  // Setup, performed on module loading

  var routeProvider; // To set routes dynamically we need to keep a
                     // reference to their provider.

  angular.module('site-main').config(function ($routeProvider) {

    routeProvider = $routeProvider;
  });

  // Init, performed after module loading

  angular.module('site-main').run(function ($route, $location, Server, Nav, Routes, Hud) {

    if(!debug){

      log = function(){};

      if(console && typeof console.log === "function"){

        console.log = log;
      }

      Hud.off();
    }

    // Set server endpoint

    Server.init({ endpoint: 'connect.php' });

    // Load nav & routes

    Server.get('/resource/pages', function (data) {

      var default_controller = 'Main';

      if(data){

        Routes
          .init(data.routes, routeProvider, default_controller);
        Nav
          .init(data.pages);
      }
    });
  });

}());
