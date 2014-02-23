'use strict';

describe('Service: Routes', function () {

  // Setup

  var Routes,
      $location,
      $routeProvider;

  var data = [

      {title: "Home", url: "/", view: "home.html"},
      {title: "Animals", url: "/animals", view: "animals.html"},
      {title: "Apes", url: "/animals/apes", view: "apes.html"},
      {title: "Monkeys", url: "/animals/monkeys", view: "monkeys.html"},
      {title: "Gorillas", url: "/animals/apes/gorillas", view: "gorillas.html"},
      {title: "Chimpanzees", url: "/animals/monkeys/chimpanzees", view: "chimpanzees.html"},
      {title: "About", url: "/about", view: "about.html"},

  ];

  beforeEach(function () {

    module('ngRoute');
    module('routes', function(_$routeProvider_){

      $routeProvider = _$routeProvider_;

      $routeProvider
        .when('/flowers', { templateUrl: '/plants/flowers.html' })
        .when('/about', { templateUrl: 'not-about.html' })
        .otherwise({ redirectTo: '/flowers' });
    });

    inject(function (_Routes_, _$location_) {

      Routes = _Routes_;
      Routes.init(data, $routeProvider, 'DefaultController', '/animals');

      $location = _$location_;
    });
  });

  // Tests

  it('has routes', function () {

    var routes = Routes.getRoutes();
    expect(_.size(routes)).toBeGreaterThan(0);
  });

  it('adds routes', function () {

    var routes = Routes.getRoutes();
    var found  = 0;

    // All dynamically set routes defined

    _.each(data, function (value) {

      expect(routes[value.url]).toBeDefined();
    });

    // All predefined routes still there

    expect(routes['/flowers']).toBeDefined();
    expect(routes['/flowers'].templateUrl).toBe('/plants/flowers.html');

    // though they could have been overwritten

    expect(routes['/about']).toBeDefined();
    expect(routes['/about'].templateUrl).not.toBe('not-about.html');
  });

  it('may set a default route', function () {

    var routes = Routes.getRoutes();
    var otherwise_route = routes['null'].redirectTo;

    expect(otherwise_route).not.toBe('/flowers');
    expect(otherwise_route).toBe('/animals');
  });

});
