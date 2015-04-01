'use strict';

describe('Service: HttpInterceptor', function () {

  var HttpInterceptor,
      $http,
      $httpBackend,
      $rootScope;

  var $httpProvider;

  beforeEach(function () {

    module('http');

    // How to bind a provider, if needed.
    // @see angular docs - AUTO.$provide
    // @see http://stackoverflow.com/a/19301714/3323348
    module(function(_$httpProvider_) {

      $httpProvider = _$httpProvider_;
    });

    inject(function (_HttpInterceptor_, _$http_, _$httpBackend_, _$rootScope_) {

      HttpInterceptor = _HttpInterceptor_;
      $http           = _$http_;
      $httpBackend    = _$httpBackend_;
      $rootScope      = _$rootScope_;
    });
  });

  afterEach(function() {

    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  it('should be set as interceptor in the http service provider', function () {

    expect($httpProvider.interceptors).toContain('HttpInterceptor');
  });

  it('should reject an erroneous response and issue a message', function () {

    spyOn(HttpInterceptor, 'responseError').and.callThrough();

    $httpBackend
      .expectGET('/')
      .respond(400);

    $http
      .get('/')
      .catch(function (response) {

        expect(response.status).toBe(400);
      });

    $httpBackend.flush();
    expect(HttpInterceptor.responseError).toHaveBeenCalled();
  });

  it('should emit an error event', function () {

    spyOn($rootScope, '$emit').and.callThrough();

    $httpBackend
      .expectGET('/')
      .respond(400);
    $http
      .get('/')
    $httpBackend
      .flush();

    expect($rootScope.$emit).toHaveBeenCalledWith('HttpResponseError', jasmine.any(Object));
  });
});
