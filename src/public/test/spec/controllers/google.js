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

    xit('should do something', function () {});

  });
});
