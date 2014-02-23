'use strict';

describe('Controller: App', function () {

  beforeEach(module('app'));

  var App,
      scope;

  var subscriptions = [];

  beforeEach(
    inject(function ($controller, $rootScope) {

      // Collect all subscriptions to top level events

      spyOn($rootScope, '$on').and.callFake(function () {

        var subscription = $rootScope.$on.calls.allArgs().pop();
        var name = subscription[0];

        subscriptions.push(name);
      });

      // Initialize the controller and a mock scope

      scope = $rootScope.$new();
      App   = $controller('App', {

        $scope: scope
      });
    })
  );

  it('should listen to all kinds of top level events', function () {

    var expected = [
      'HttpResponseError',
      '$destroy'
    ];

    expect(subscriptions).toEqual(expected);
  });
});
