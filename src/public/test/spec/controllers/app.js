'use strict';

describe('Controller: App', function () {

  beforeEach(module('app'));

  var App,
      Errors;

  var scope,
      $rootScope,
      $location;

  beforeEach(
    inject(function ($controller, _$rootScope_, _Errors_, _$location_) {

      $rootScope = _$rootScope_;
      $location  = _$location_;

      // Initialize the controller and a mock scope

      scope = $rootScope.$new();
      App   = $controller('App', {

        $scope: scope
      });

      Errors = _Errors_;
    })
  );


  describe("Errors", function () {

    it('should register errors to a central service when an error event occurs', function () {

      $location.path('/err');
      //$rootScope.$emit('$routeChangeStart', {status: 400});

      log(Errors.getErrors(), $location.path());
      //$rootScope.$emit('HttpResponseError', {status: 400});
      log(Errors.getErrors(), $location.path());
    });

    it('should intercept route change events');
  });
});
