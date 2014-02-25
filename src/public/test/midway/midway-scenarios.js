'use strict;'

/**
 * Midway testing
 *
 * @see https://github.com/yearofmoo/ngMidwayTester
 * @see https://github.com/yearofmoo-articles/AngularJS-Testing-Article/tree/master/test/midway
 *
 * Caveats: Somewhat unDRY because we need to duplicate parts of our
 *          setup code from app.js & index.html - on the other hand
 *          this might give you a more fine grained control of your
 *          test setup.
 */

describe("Midway Testing", function() {

  var tester,
      data;

  var Nav,
      Routes;

  // Load some test data up front

  before(function(done) {

    jQuery
      .getJSON('connect.php/public-config', function (response) {

        data = response;
        done();
      })
      .fail(function (response) {

        log("No initial data. Check url & Karma's proxy settings.");
        done();
      });
  });

  // Bootstrap app

  beforeEach(function() {

    // Reopen main module to add test data.
    //
    // All settings done in app.js's angular....config()
    // are still set (e.g., all core routes).
    angular.module('app').config(function (RoutesProvider) {

      RoutesProvider
        .init(data.routes, 'Main'); // 'Main' being the default controller
    });

    // Same here
    angular.module('app').run(function (Nav) {

      Nav.init(data.pages);
    });

    tester = ngMidwayTester('app', {

      templateUrl : '/test/midway-index-template.html' // REALLY important setting. Without it, ngMidwayTester
                                                       // would only know about ng-view & what's _inside_ it,
                                                       // but nothing about any other part of your app _outside_
                                                       // ng-view (top-level controllers, widgets, ...).
    });

    Routes = tester.injector().get('Routes');
    Nav    = tester.injector().get('Nav');
  });

  afterEach(function() {

    tester.destroy();
    tester = null;
  });

  describe("Automatic redirection", function(){

    it("should redirect to the index page when no route was given", function(done){

      tester.visit('', function() {

        expect(tester.path()).to.equal('/');

        log('#', tester.injector().get('Errors').getErrors());

        done();
      });

      tester.visit('/', function() {

        expect(tester.path()).to.equal('/');

        log('#',tester.injector().get('Errors').getErrors());

        done();
      });
    });
  });

  describe("Redirect to the error page", function () {

    it("when a route doesn't exist and set a 404 error", function(done) {

      tester.visit('/non-existend', function() {

        expect(tester.path()).to.equal('/error');

        log(tester.injector().get('Errors').getErrors());

        var scope = tester.viewScope();

        expect(scope.error).to.exist;
        expect(scope.error.code).to.equal(404);

        done();
      });
    });
  })
});