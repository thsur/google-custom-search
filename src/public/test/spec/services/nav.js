'use strict';

describe('Service: Nav', function () {

  // load the service's module
  beforeEach(module('publicApp'));

  // instantiate service
  var Nav;
  beforeEach(inject(function (_Nav_) {
    Nav = _Nav_;
  }));

  it('should do something', function () {
    expect(!!Nav).toBe(true);
  });

});
