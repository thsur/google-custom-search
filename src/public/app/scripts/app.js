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

    app: [

      'services',
      'server',
      'navigation',
      'butterbar',
      'hud'
    ],

    init: function () {

      // Load submodules
      this.load(this.app);

      // Build dependencies
      this.app = this.defaults.concat(this.app);
      return this;
    },

    load: function (modules) {

      for(var i = 0; i < modules.length; i++){

        angular.module(modules[i], []);
      }
    }

  }.init();

  // Main module

  angular.module('site-main', dependencies.app);

  // Setup, performed on module loading

  var routeProvider;

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
