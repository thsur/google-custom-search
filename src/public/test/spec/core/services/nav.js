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

          {title: 'Monkeys & Apes', url: "/"},
          {title: 'Apes', url: "/apes"},
          {title: 'Gorillas', url: "/apes/gorillas"},
          {title: 'Monkeys', url: "/monkeys"},
          {title: 'Chimpanzees', url: "/monkeys/chimpanzees"},
          {title: 'About', url: "/about"},

        ]);
    });
  });

  it('provides an array holding nav entries', function () {

    var entries = Nav.get();
    expect(entries.length > 0).toBe(true);
  });

  it('can tell by its url if an entry is active', function () {

    var entries = Nav.get();
    var url;

    for (var i = 0; i <= 2; i++) {

      url = entries[i].url;

      expect(Nav.isActive(url)).toBe(false);

      $location.path(url);

      expect(Nav.isActive(url)).toBe(true);
    }
  });

  // "The important thing is a thing's behaviour, not how it works."
  // (Tom Hamshere in http://stackoverflow.com/a/17265609/3323348)
  //
  // Cf. also http://josephchapman.com/post/jasmine-mocks-and-spies/
  //
  // While this holds true for most cases, here's how you would test
  // if something listens to an event:
  it('listens to location events', function () {

    // Set event listening spy before Nav.init()
    spyOn($rootScope, '$on').and.callThrough();

    // Attaches listener
    Nav.init();

    // Mimic a route change
    $location.path('/');

    expect($rootScope.$on).toHaveBeenCalledWith('$locationChangeSuccess', jasmine.any(Function));
  });
});
