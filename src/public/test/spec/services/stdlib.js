'use strict';

describe('Service: stdLib', function () {

  // load the service's module
  beforeEach(module('publicApp'));

  // instantiate service
  var stdLib;
  beforeEach(inject(function (_stdLib_) {
    stdLib = _stdLib_;
  }));

  it('should do something', function () {
    expect(!!stdLib).toBe(true);
  });

});
