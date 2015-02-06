angular.module('filters').filter('url', function() {

  return function(path) {

    return decodeURIComponent(path);
  };
});