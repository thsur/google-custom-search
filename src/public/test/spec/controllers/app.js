'use strict';

describe('Controller: App', function () {

  beforeEach(module('app'));

  var App,
      Errors;

  var scope,
      $rootScope;

  beforeEach(
    inject(function ($controller, _$rootScope_, _Errors_) {

      $rootScope = _$rootScope_;

      // Initialize the controller and a mock scope

      scope = $rootScope.$new();
      App   = $controller('App', {

        $scope: scope
      });

      Errors = _Errors_;
    })
  );

  describe("Dispatches error events", function () {

    it('should register errors to a central service when an error event occurs', function () {

      $rootScope.$emit('HttpResponseError', {status: 'mock-me'});
      log(Errors.getErrors());
    });
  });
});
