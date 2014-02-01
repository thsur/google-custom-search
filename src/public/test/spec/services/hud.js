'use strict';

describe('Service: Hud', function () {

  // load the service's module
  beforeEach(module('publicApp'));

  // instantiate service
  var Hud;
  beforeEach(inject(function (_Hud_) {
    Hud = _Hud_;
  }));

  it('should do something', function () {
    expect(!!Hud).toBe(true);
  });

});
