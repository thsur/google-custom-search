'use strict';

angular.module('services').service('Nav', function Nav() {

  // Full tree

  var tree = [];

  // Active branches

  var branches = [];

  // Which entry is active in which branch.

  var rootline = [0]; // Needs a default value

  // Check if a requested rootline level is valid.

  var rootlineHasLevel = function (level) {

    return (typeof rootline[level] !== 'undefined');
  };

  // Get children of active element, if any.

  var activeGetChildren = function (level) {

    if(!rootlineHasLevel(level)) return;

    var tree = tree;

    for(var i = 0; i <= level; i++){

      var active = this.getActive(i);

      if(!(tree[active] && tree[active].children)){

        return;
      }

      tree = tree[active].children;
    }

    return tree;
  };

  this.branches = branches;

  this.getBranch = function (level) {

    if(!level || level == 0){

      return tree;
    }

    return activeGetChildren(level);
  };

  this.getActive = function (level) {

    return rootlineHasLevel(level) ? rootline[level] : null;
  };

  this.setActive = function (level, num) {

    // Level not in rootline

    if(!rootlineHasLevel(level)){

      // Out of bounds check:
      // Level must be only one step beyond
      // the current rootline.

      if(level - rootline.length !== 0){

        return;
      }
    }

    // Num (i.e. entry index) not in branch

    var tree = this.getBranch(level);

    if(!tree || num > tree.length - 1){

      return;
    }

    // Update rootline

    rootline[level] = num;
    rootline.splice(level + 1, rootline.length);

    // Update branches
    branches[level] = tree;
    branches.splice(level + 1, rootline.length);

    log(tree, level, rootline, this.getActive(level), branches[level])
  }

  this.init = function (navtree) {

    _.each(navtree, function (item) { tree.push(item); });
    this.setActive(0,0);
  };

  return this;
});
