'use strict';

describe('Service: Nav', function () {

  // Mock Routes service

  angular.module('routesMock', []).service('Routes', function($rootScope){

    this.active = {};
    this.setActive = function (route) {

      this.active.route = route;
      $rootScope.$emit('$locationChangeSuccess');
    };
  });

  beforeEach(module('navigation'));
  beforeEach(module('routesMock'));

  // Setup

  var Nav,
      Routes,
      $rootScope;

  beforeEach(inject(function (_Nav_, _Routes_, _$rootScope_) {

    Nav        = _Nav_;
    Routes     = _Routes_;
    $rootScope = _$rootScope_;

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
  }));

  it('should fetch pages for a certain navigation level', function () {

    var branch  = Nav.getByLevel();
    var compare = [

        {id: 0, url: "/"},
        {id: 1, url: "/animals"},
        {id: 6, url: "/about"},
    ];

    expect(branch).toEqual(compare);

    // Mimic user hits a page
    Routes.setActive('/animals');

    branch  = Nav.getByLevel(1);
    compare = [

        {id: 2, url: "/animals/apes", parent: 1},
        {id: 4, url: "/animals/monkeys", parent: 1},
    ];

    expect(branch).toEqual(compare);

    // Mimic user hits a page
    Routes.setActive('/animals/monkeys');

    branch  = Nav.getByLevel(2);
    compare = [

        {id: 5, url: "/animals/monkeys/chimpanzees", parent: 4},
    ];

    expect(branch).toEqual(compare);
  });

  it('should fetch pages for a level other than level 0 only when parent is active', function () {

    Routes.setActive('/non-existent');

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

    var page_id = 0;

    Routes.setActive('/non-existent');
    expect(Nav.isActive(page_id)).toBe(false);

    Routes.setActive('/');
    expect(Nav.isActive(page_id)).toBe(true);
  });

  it('maintains a rootline, i.e. a stack of active pages', function () {

    Routes.setActive('/');
    expect(Nav.getRootline()).toEqual([0]);

    Routes.setActive('/animals/apes');
    expect(Nav.getRootline()).toEqual([1,2]);

    Routes.setActive('/animals/apes/gorillas');
    expect(Nav.getRootline()).toEqual([1,2,3]);

    Routes.setActive('/animals');
    expect(Nav.getRootline()).toEqual([1]);

    Routes.setActive('/non-existent');
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
    Routes.setActive('/');

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
