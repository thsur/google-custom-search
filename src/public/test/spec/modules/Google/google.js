'use strict';

describe('Controller: Google', function () {

  var Server;

  var scope,
      $httpBackend,
      $rootScope,
      $location;

  var controllerFactory;

  beforeEach(module('app'));

  beforeEach(
    inject(function ($controller, _$rootScope_, _$location_, _$httpBackend_, _Server_) {

      $httpBackend = _$httpBackend_;
      $rootScope   = _$rootScope_;
      $location    = _$location_;

      Server = _Server_;

      // For easier testing, unset endpoint on Server

      Server.init({ endpoint: '' });

      // Initialize a mock scope

      scope = $rootScope.$new();

      // Provide a factory function for the controller

      controllerFactory = function() {

        return $controller('Google', {

          '$scope': scope,
          'Server': Server
        });
      };
    })
  );

  describe('Getting and saving data', function () {

    afterEach(function() {

       $httpBackend.verifyNoOutstandingExpectation();
       $httpBackend.verifyNoOutstandingRequest();
    });

    it('loads a list of saved queries when instantiated', function () {

      /**
       * The controller issues more than one request on startup, which may
       * cause an 'unexpected request' error - unless we make sure every
       * request is handled und thus expected.
       *
       * @see http://stackoverflow.com/a/22405251/3323348
       */
      $httpBackend.whenGET('/tags').respond(200, [{}]);

      $httpBackend.expectGET('/search/google').respond(200, [{}]);
      controllerFactory();
      $httpBackend.flush();

      expect(scope.queries).toEqual([{}]);
    });

    it('loads a list of tags when instantiated', function () {

      /**
       * The controller issues more than one request on startup, which may
       * cause an 'unexpected request' error - unless we make sure every
       * request is handled und thus expected.
       *
       * @see http://stackoverflow.com/a/22405251/3323348
       */
      $httpBackend.whenGET('/search/google').respond(200, [{}]);

      $httpBackend.expectGET('/tags').respond(200, [{}]);
      controllerFactory();
      $httpBackend.flush();

      expect(scope.tags).toEqual([{}]);
    });

    it('sends a changed result set to the server (result, collected items, trash)', function () {

      $httpBackend.whenGET('/search/google').respond(200, [{}]);
      $httpBackend.whenGET('/tags').respond(200, [{}]);

      controllerFactory();

      $httpBackend.expectPOST('/search/update').respond(200);
      scope.save();
      $httpBackend.flush();
    });

    it('sends a Google query to the server', function () {

      $httpBackend.whenGET('/search/google').respond(200, [{}]);
      $httpBackend.whenGET('/tags').respond(200, [{}]);

      controllerFactory();

      $httpBackend.expectPOST('/search/google').respond(200, [{}]);
      scope.initSearch();
      $httpBackend.flush();
    });
  });

  describe("Collecting and tagging", function () {

    var Controller;

    beforeEach(inject(function ($controller) {

      Controller = controllerFactory();

      // Mock a result set

      scope.results = {

        items: [{}, {}, {}]
      };
    }));

    it('collects query result items by substracting them from the result set', function () {

      var len_results = scope.getResults().length;

      expect(scope.hasCollected()).toBe(false);

      scope.collectQueryItem(0, {});

      expect(scope.hasCollected()).toBe(true);
      expect(scope.getResults().length).toEqual(len_results - 1);
    });

    it('pushes back collected items into the result set', function () {

      var len_results;

      scope.collectQueryItem(0, {});

      expect(scope.hasCollected()).toBe(true);
      len_results = scope.getResults().length;

      scope.removeCollectedItem(0, {});

      expect(scope.hasCollected()).toBe(false);
      expect(scope.getResults().length).toEqual(len_results + 1);
    });

    it('deletes a result set item into the trash', function () {

      var len_results = scope.getResults().length;

      expect(scope.hasTrash()).toBe(false);

      scope.deleteQueryItem(0, {});

      expect(scope.hasTrash()).toBe(true);
      expect(scope.getResults().length).toEqual(len_results - 1);
    });

    it('restores an item from trash back into the result set', function () {

      var len_results;

      scope.deleteQueryItem(0, {});

      expect(scope.hasTrash()).toBe(true);
      len_results = scope.getResults().length;

      scope.restoreQueryItem(0, {});

      expect(scope.hasTrash()).toBe(false);
      expect(scope.getResults().length).toEqual(len_results + 1);
    });

    it('empties the trash, thus reducing the result set', function () {

      var len_results;

      scope.deleteQueryItem(0, {});

      expect(scope.hasTrash()).toBe(true);
      len_results = scope.getResults().length;

      scope.emptyTrash();

      expect(scope.hasTrash()).toBe(false);
      expect(scope.getResults().length).toEqual(len_results);
    });

    it('adds and removes tags to a collected item', function () {

      scope.collectQueryItem(0, {});

      scope.toggleTag(0, 'a_tag');
      scope.toggleTag(0, 'b_tag');

      expect(scope.collected[0].tags['a_tag']).toBeDefined();
      expect(scope.collected[0].tags['b_tag']).toBeDefined();

      scope.toggleTag(0, 'b_tag');

      expect(scope.collected[0].tags['b_tag']).not.toBeDefined();
    });
  });
});
