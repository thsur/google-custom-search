'use strict';

angular.module('navigation').service('Nav', function Nav (Routes) {

  var config = {

    subpages_key: 'pages'
  }

  // Full tree

  var tree = [];

  // Which entry is active on which tree level.

  var rootline = [];

  // Check if a requested tree level is in the rootline.

  var rootlineHasLevel = function (level) {

    return (typeof rootline[level] !== 'undefined');
  };

  // Alias to rootline to make it bindable
  // by the outside world.

  this.rootline = rootline;

  // Get a subtree.

  this.getBranch = function (level) {

    if(!level || level == 0){

      return tree;
    }

    // Get children of active element, if any.

    var branch   = tree;
    var children = config.subpages_key;

    for(var i = 0; i < level; i++){

      var active = this.getActive(i);

      if(!(branch[active] && branch[active][children])){

        return [];
      }

      branch = branch[active][children];
    }

    return branch;
  };

  // Get active entry index on given level.

  this.getActive = function (level) {

    return rootlineHasLevel(level) ? rootline[level] : null;
  };

  this.setActive = function (level, num) {

    // Level not in rootline

    if(!rootlineHasLevel(level)){

      // Out of bounds check:
      // Abort if level > (highest index + 1)

      if(level > rootline.length) {

        return;
      }
    }

    // Entry index not in subtree

    var tree = this.getBranch(level);

    if(!tree || num >= tree.length){

      return;
    }

    // Update rootline

    rootline[level] = num;
    rootline.splice(level + 1, rootline.length);
  }

  this.init = function (nav, user_config) {

    if(config){

      angular.extend(config, user_config);
    }

    // Merge own with given tree

    angular.forEach(nav, function (item) { tree.push(item); });

    // Set first entry on first level as active, thus
    // initialising the rootline.

    this.setActive(0,0);
  };
});
