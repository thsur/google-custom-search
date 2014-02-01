'use strict';

describe('Service: server', function () {

  // load the service's module
  beforeEach(module('publicApp'));

  // instantiate service
  var server;
  beforeEach(inject(function (_server_) {
    server = _server_;
  }));

  it('should do something', function () {
    expect(!!server).toBe(true);
  });

});
