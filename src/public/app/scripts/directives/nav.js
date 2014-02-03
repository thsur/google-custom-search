'use strict';

angular.module('site-main').directive('nav', function (Nav) {

  var level = 0;

  return {

    restrict: 'A',
    scope: true,
    controller: function($scope, $element, $attrs) {

      level = $element.data('level');

      if(!_.isNumber(level)){

        level = 0;
      }
    },
    link: function (scope, element, attrs) {

      var branches = scope.branches = Nav.branches;

      var nav = {

        level: level,
        tree: branches[level],
      };

      var update = function(){

        nav.tree = branches[nav.level];
        log(branches, '####', nav.level);
        log(level);
      }

      scope.$watchCollection('branches', function(branches){

        update();
        //nav.tree = branches[nav.level];

        log(nav.tree, branches, level);
      });

      //nav.tree = Nav.getTree(nav.level);

      nav.active = function(){

        return Nav.getActive(nav.level);
      }

      scope.nav = {

        tree: nav.tree,
        isActive: function (num) {

          return num === nav.active();
        },
        setActive: function (num) {

          Nav.setActive(nav.level, num);
        }
      };

      log(scope.nav, level, 'scope.nav');
    }
  };
});
