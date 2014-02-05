'use strict';

angular.module('site-main').directive('button', function () {

  return {

    template: '<div></div>',
    restrict: 'E',
    link: function (scope, element, attrs) {

      element.text('this is the button directive');
    }

  };
});
