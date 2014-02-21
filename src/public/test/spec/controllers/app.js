'use strict';

describe('Controller: App', function () {

  beforeEach(module('app'));

  var App,
      scope;

  // Initialize the controller and a mock scope

  beforeEach(
    inject(function ($controller, $rootScope) {

      scope = $rootScope.$new();
      App   = $controller('App', {

        $scope: scope
      });
    })
  );

  it('should do something', function () {

    expect(scope.awesomeThings).toBeUndefined();
  });
});
