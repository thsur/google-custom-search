'use strict';

describe('Service: HttpInterceptor', function () {

  var HttpInterceptor,
      $http,
      $httpBackend,
      $rootScope;

  var $httpProvider;

  /*
  beforeEach(module('http', function ($httpProvider) {

    httpProvider = $httpProvider;
  }));
  */
  /*
  beforeEach(module(function($provide) {

    //$provide.provider('$http', $httpProvider);
  }));
  */

  /*
  beforeEach(module('http', function($httpProvider) {

    $httpProvider.interceptors.push('HttpInterceptor');
  }));
  */

  beforeEach(module('http'));

  beforeEach(function () {

    module(function ($provide, $httpProvider) {

       $provide.provider('$http', $httpProvider);
    });

    module(function(_$httpProvider_) {

      $httpProvider = _$httpProvider_;
      // Configure eventTracker provider
      console.log('#####', _$httpProvider_, httpProvider);
      //eventTrackerProvider.setTrackingUrl('/custom-track');
    });

    inject(function (_HttpInterceptor_, _$http_, _$httpBackend_, _$rootScope_) {

      HttpInterceptor = _HttpInterceptor_;
      $http           = _$http_;
      $httpBackend    = _$httpBackend_;
      $rootScope      = _$rootScope_;

    });
  });

  /*
  afterEach(function() {

    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });
  */

  it('should reject an erroneous response and issue a message', function () {

    log($httpProvider.interceptors);

    spyOn(HttpInterceptor, 'responseError').and.callThrough();

    $httpBackend
      .expectGET('/')
      .respond(400);

    $http
      .get('/')
      .catch(function (response) {

        log('Msg from interceptor is:', response);
      });

    //log('Interceptor is', HttpInterceptor);
    //HttpInterceptor.responseError();

    //expect(HttpInterceptor.responseError).toHaveBeenCalled();
    $httpBackend.flush();
  });

});
