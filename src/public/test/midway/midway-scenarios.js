'use strict;'

describe("Midway Testing", function() {

  var tester,
      data;

  var Nav,
      Routes;

  // Load some data up front

  before(function(done) {

    jQuery
      .getJSON('connect.php/resource/pages', function (response) {

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

    var $routeProvider;

    // Reopen module.
    // All settings done in app.js's angular....config()
    // are still set (e.g., all core routes).
    angular.module('app').config(function (_$routeProvider_) {

      $routeProvider = _$routeProvider_;
    });

    angular.module('app').run(function ($route, Routes, Nav) {

      var data = data;

      if(data){

        Routes
          .init(data.routes, $routeProvider, 'Main'); // 'Main' being the default controller
        Nav
          .init(data.pages);
      }
    });

    tester = ngMidwayTester('app');

    Routes = tester.injector().get('Routes');
    Nav    = tester.injector().get('Nav');
  });

  afterEach(function() {

    tester.destroy();
    tester = null;
  });

  describe("Error handling", function () {

    it("should redirect to root if a route doesn't exist", function(done) {

      tester.visit('/non-existend', function() {

        expect(tester.path()).to.equal('/error');

        //expect(tester.viewElement().html()).to.contain('error');
        //var scope = tester.viewScope();
        //expect(scope.title).to.equal('my home page');
        done();
      });
    });

    it("should have a working error route", function() {

      //expect(ROUTER.routeDefined('videos_path')).to.equal(true);
      //var url = ROUTER.routePath('videos_path');
      //expect(url).to.equal('/videos');
    });
  })
});