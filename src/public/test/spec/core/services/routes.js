'use strict';

describe('Service: Routes', function () {

  // Setup

  var Routes,
      $location;

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
    module('routes', function($routeProvider, RoutesProvider){

      $routeProvider
        .when('/flowers', { templateUrl: '/plants/flowers.html' })
        .when('/about', { templateUrl: 'not-about.html' })
        .otherwise({ redirectTo: '/flowers' });

      RoutesProvider
        .init(data, 'DefaultController', '/animals');
    });

    inject(function (_Routes_, _$location_) {

      Routes = _Routes_;
      $location = _$location_;
    });
  });

  // Tests

  it('has routes', function () {

    var routes = Routes.getRoutes();
    expect(_.size(routes)).toBeGreaterThan(0);
  });

  it('adds dynamically defined routes to preconfigured ones', function () {

    var routes = Routes.getRoutes();

    // All dynamically set routes defined

    _.each(data, function (value) {

      expect(routes[value.url]).toBeDefined();
    });

    // All predefined routes still there

    expect(routes['/flowers']).toBeDefined();
    expect(routes['/flowers'].templateUrl).toBe('/plants/flowers.html');
    expect(routes['/about']).toBeDefined();

    // though they could have been overwritten

    expect(routes['/about'].templateUrl).not.toBe('not-about.html');
  });

  it('may set a default route', function () {

    var routes = Routes.getRoutes();
    var otherwise_route = routes['null'].redirectTo;

    expect(otherwise_route).not.toBe('/flowers');
    expect(otherwise_route).toBe('/animals');
  });

  it('listens to location changes');
  it('holds the path of the current active route, if there is one');
});
