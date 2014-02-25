'use strict';

describe('Service: Nav', function () {

  // Mock Routes service

  angular.module('routesMock', []).service('Routes', function($rootScope){

    var active = this.active = {};

    $rootScope.$on('$locationChangeSuccess', function (event, current) {

      active.route = current;
    })
  });

  beforeEach(module('ngRoute'));
  beforeEach(module('navigation'));
  beforeEach(module('routesMock'));

  // Setup

  var Nav,
      Routes,
      $rootScope,
      $location;

  beforeEach(function () {
    inject(function (_Nav_, _Routes_, _$rootScope_) {

      Nav        = _Nav_;
      Routes     = _Routes_;
      $rootScope = _$rootScope_;

      $location  = {

        path: function (path) {

          $rootScope.$emit('$locationChangeSuccess', path);
        }
      };

      Nav
        .init([

          {id: 0, url: "/"},
          {id: 1, url: "/animals"},
          {id: 2, url: "/animals/apes", parent: 1},
          {id: 3, url: "/animals/apes/gorillas", parent: 2},
          {id: 4, url: "/animals/monkeys", parent: 1},
          {id: 5, url: "/animals/monkeys/chimpanzees", parent: 4},
          {id: 6, url: "/about"},

        ]);
    });
  });

 it('should fetch pages for a certain navigation level', function () {

    var branch  = Nav.getByLevel();
    var compare = [

        {id: 0, url: "/"},
        {id: 1, url: "/animals"},
        {id: 6, url: "/about"},
    ];

    expect(branch).toEqual(compare);

    // Mimic user hits a page
    $location.path('/animals');

    branch  = Nav.getByLevel(1);
    compare = [

        {id: 2, url: "/animals/apes", parent: 1},
        {id: 4, url: "/animals/monkeys", parent: 1},
    ];

    expect(branch).toEqual(compare);

    // Mimic user hits a page
    $location.path('/animals/monkeys');

    branch  = Nav.getByLevel(2);
    compare = [

        {id: 5, url: "/animals/monkeys/chimpanzees", parent: 4},
    ];

    expect(branch).toEqual(compare);
  });

  it('should fetch pages for a level other than level 0 only when parent is active', function () {

    $location.path('/non-existent');

    expect(Nav.getByLevel(1).length).toBe(0);
    expect(Nav.getByLevel(0).length).toBe(3); // or: Nav.getByLevel()
  });

  it('should fetch pages for a given page id no matter if it is active or not', function () {

    var branch  = Nav.getById(1);
    var compare = [

        {id: 2, url: "/animals/apes", parent: 1},
        {id: 4, url: "/animals/monkeys", parent: 1},
    ];

    expect(branch).toEqual(compare);
  });

  it('should tell if a page is active', function () {

    var page_id = 1;

    $location.path('/non-existent');
    expect(Nav.isActive(page_id)).toBe(false);

    $location.path('/animals');
    expect(Nav.isActive(page_id)).toBe(true);
  });

  it('maintains a rootline, i.e. a stack of active pages', function () {

    $location.path('/');
    expect(Nav.getRootline()).toEqual([0]);

    $location.path('/animals/apes');
    expect(Nav.getRootline()).toEqual([1,2]);

    $location.path('/animals/apes/gorillas');
    expect(Nav.getRootline()).toEqual([1,2,3]);

    $location.path('/animals');
    expect(Nav.getRootline()).toEqual([1]);

    $location.path('/non-existent');
    expect(Nav.getRootline()).toEqual([]);
  });

  // "The important thing is a thing's behaviour, not how it works."
  // (Tom Hamshere in http://stackoverflow.com/a/17265609/3323348)
  //
  // Cf. also http://josephchapman.com/post/jasmine-mocks-and-spies/
  //
  // While this holds true for most cases, here's how you would test
  // if something listens to an event:
  it('should update the rootline by listening to an appropriate event', function () {

    // Set event listening spy before Nav.init()
    spyOn($rootScope, '$on').and.callThrough();

    // Attaches listener
    Nav.init();

    // Mimic a route change
    $location.path('/');

    expect($rootScope.$on).toHaveBeenCalledWith('$locationChangeSuccess', jasmine.any(Function));
  });

  it('should always provide an array', function () {

    var valid   = Nav.getByLevel();
    var invalid = Nav.getByLevel(100);

    expect(valid).toEqual(jasmine.any(Array));
    expect(invalid).toEqual(jasmine.any(Array));

    valid   = Nav.getById(1);
    invalid = Nav.getById(100);

    expect(valid).toEqual(jasmine.any(Array));
    expect(invalid).toEqual(jasmine.any(Array));

    Nav.init([]);
    expect(Nav.getPages()).toEqual(jasmine.any(Array));

    Nav.init({});
    expect(Nav.getPages()).toEqual(jasmine.any(Array));

    Nav.init();
    expect(Nav.getPages()).toEqual(jasmine.any(Array));
  });
});
