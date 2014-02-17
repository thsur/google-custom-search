'use strict';

angular.module('navigation').service('Nav', function Nav (Routes) {

  var pages = [];

  // Which entries are active.
  // Rootline depth corresponds to nav level (cf. getBranches()).

  var rootline = [];

  // Alias to rootline to make it bindable
  // by the outside world.

  this.rootline = rootline;

  // @protected

  var getChildren = function (parent) {

    parent = _.isNumber(parent) ? parent : null;

    // Loops whole list. Refactor when list is large.
    return _.filter(pages, function(page){

      if(parent === null){

        return !page.parent;
      }

      return page.parent === parent;
    });
  };

  // @protected

  var updateRootline = function () {

    var active = Routes.active.route;
    var queue  = [];

    if(!active) return;

    // Get all up to current active entry

    var fillQueue = function () {

      for(var i = 0, page; page = pages[i]; i++){

        queue.push(page);

        if(page.url === active || active === '/' && page.url === null){

          return true;
        }
      }
    };

    if(!fillQueue()) return;

    // Filter out siblings and stop at
    // first top level entry found.

    queue.reverse();

    var _rootline = [queue[0].id];
    var next      = queue[0].parent;
    var i         = 1;

    while(next && i < queue.length){

      if(queue[i].id === next){

        _rootline.push(next);
        next = queue[i].parent;
      }

      i++;
    }

    rootline = _rootline.reverse();
  };

  // Get a subtree.

  this.getBranch = function (level) {

    updateRootline(level);

    if(level === 0){

      return getChildren();
    }

    if(rootline[level-1]){

      return getChildren(rootline[level-1]);
    }
  };

  // Get active entry index on given level.

  this.isActive = function (id) {

    return _.indexOf(rootline, id) !== -1;
  };

  this.init = function (nav) {

    pages = nav;
  };
});
