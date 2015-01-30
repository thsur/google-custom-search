'use strict';

angular.module('navigation').service('Nav', function Nav ($rootScope, Routes) {

  var entries = [];
  var active;

  /**
   * Get entries array
   */

  this.get = function(){

    return entries;
  };

  /**
   * Get active entry index on given level
   */

  this.isActive = function (url) {

    return url === active;
  };

  /**
   * Setup
   */

  this.init = function (nav) {

    entries = angular.isArray(nav) ? nav : [];

    $rootScope.$on('$locationChangeSuccess', function() {

      active = Routes.active.route;
    });
  };
});
