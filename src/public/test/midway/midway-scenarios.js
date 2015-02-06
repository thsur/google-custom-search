'use strict;'

/**
 * Midway testing
 *
 * @see https://github.com/yearofmoo/ngMidwayTester
 * @see https://github.com/yearofmoo-articles/AngularJS-Testing-Article/tree/master/test/midway
 *
 * For spies & stubbing & mocking with chai, get:
 *
 * https://github.com/domenic/sinon-chai
 *
 */

describe("Midway Testing", function () {

  var tester,
      routes,
      $location,
      $rootScope;

  var Nav,
      Routes,
      Server;

  // Load some test data up front

  before(function (done) {

    angular.module('app').config(function ($locationProvider) {

      // We operate on the body of midway-index-template.html only,
      // so we're unable to set a base tag - which is why we need to
      // switch off '#'-less mode for urls.
      $locationProvider.html5Mode(false);
    });

    jQuery
      .getJSON('connect.php/routes', function (response) {

        routes = response;
        done();
      })
      .fail(function (response) {

        log("No initial data. Check url & Karma's proxy settings. Response: " + response.status + " " + response.statusText);
        done();
      });
  });

  // Bootstrap app

  beforeEach(function () {

    // Reopen main module to add test data.
    // All settings done in app.js's angular.config()
    // are still set (e.g., all core routes).
    angular.module('app').config(function (RoutesProvider) {

      RoutesProvider
        .init(routes, 'Main'); // 'Main' being the default controller
    });

    // Same here
    angular.module('app').run(function (Nav) {

      Nav.init(routes);
    });

    tester = ngMidwayTester('app', {

      templateUrl : '/test/midway-index-template.html' // REALLY important setting. Without it, ngMidwayTester
                                                       // would only know about ng-view & what's _inside_ it,
                                                       // but nothing about any other part of your app _outside_
                                                       // ng-view (top-level controllers, widgets, ...).
    });

    $location  = tester.injector().get('$location');
    $rootScope = tester.injector().get('$rootScope');

    Routes = tester.injector().get('Routes');
    Nav    = tester.injector().get('Nav');
    Server = tester.injector().get('Server');
  });

  afterEach(function () {

    tester.destroy();
    tester = null;
  });

  describe("App", function () {

    it("has an index route", function (done) {

      tester.visit('/', function () {

          expect(tester.path()).to.equal('/');
          done();
      });
    });

    it("redirects to error when a server request fails", function (done) {

      Server
        .get('/non-existend')
        .catch(function (response) {

          expect(response.status).to.match(/^(4|5)[0-9]{2}$/);
          expect(tester.path()).to.equal('/error');
          done();
        });
    });
  });

  describe("Google", function () {

    var controller,
        scope;

    xit("redirects to login when the server responds with a 401", function (done) {

      Server
        .post('/login', [])
        .catch(function (response) {

          expect(response.status).to.equal(401);
          expect(tester.path()).to.equal('/login');
          done();
        });
    });

    xit("redirects to login when a access-restricted route responds with a 401");
  })
});