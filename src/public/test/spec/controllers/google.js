'use strict';

describe('Controller: Google', function () {


  var Controller;

  var scope,
      $rootScope,
      $location;

  beforeEach(module('app'));

  beforeEach(
    inject(function ($controller, _$rootScope_, _$location_, _$httpBackend_) {

      $rootScope = _$rootScope_;
      $location  = _$location_;

      // Initialize the controller and a mock scope

      scope      = $rootScope.$new();
      Controller = $controller('Google', {

        $scope: scope
      });
    })
  );

  beforeEach(function () {

    // Expect controller to have a model defined
    expect(scope.query).toBeDefined();

    // Set it up, i.e. mock a search
    scope.query = 'my search';
  });

  describe("Search", function () {

    it('should do something', function (done) {

      var promise = function() {

        jQuery.get({

          'url': 'connect.php/routes',
          'async': true
        })
        .done(function (response) {

            log(response);
            done();
        })
        .fail(function (response) {

          log("No data received. Check url & Karma's proxy settings. Response: " + response.status + " " + response.statusText);
          expect(response.status).toBe(404);
          done();
        });

      };

      promise();
      // expect(4).toBe(3);
    });
  });
});
