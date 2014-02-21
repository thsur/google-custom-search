'use strict';

/**
 * General advice on angular testing:
 *
 * @see http://docs.angularjs.org/guide/dev_guide.unit-testing
 * @see http://andyshora.com/unit-testing-best-practices-angularjs.html
 * @see http://www.yearofmoo.com/2013/01/full-spectrum-testing-with-angularjs-and-karma.html
 * @see http://www.yearofmoo.com/2013/09/advanced-testing-and-debugging-in-angularjs.html
 */

describe('Service: Server', function () {

  // Load module

  beforeEach(module('http'));

  // Mock interceptor (i.e.: replace it)

  angular.module('http').factory('HttpInterceptor', function ($q) {

    return {
      responseError: function (response) { return $q.reject(response); }
    };
  });

  // Setup & Teardown

  var Server,
      $httpBackend;

  beforeEach(
    inject(function (_Server_, _$httpBackend_) {

      Server       = _Server_;
      $httpBackend = _$httpBackend_;
    })
  );

  afterEach(function() {

    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  // Tests

  it('should issue a request', function () {

    $httpBackend
      .expectGET('/something')
      .respond();

    Server.get('/something');
    $httpBackend.flush();
  });

  it('should issue a request to a configurable endpoint', function () {

    Server.init({endpoint: 'endpoint'});

    $httpBackend
      .expectGET('endpoint/something')
      .respond();

    Server.get('/something');

    $httpBackend.flush();
  });

  it('should return a promise on success and error', function () {

    $httpBackend
      .expectGET('/something')
      .respond(200);

    Server
      .get('/something')
      .then(function (response) {

        expect(response.status).toBe(200);
      });

    $httpBackend.flush();

    $httpBackend
      .expectGET('/something')
      .respond(404);

    Server
      .get('/something')
      .catch(function (response) {

        expect(response.status).toBe(404);
      });

    $httpBackend.flush();
  });
});
