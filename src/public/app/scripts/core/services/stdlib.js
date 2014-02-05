'use strict';

angular.module('stdLib').factory('stdLib', function () {

  return {

    // Optain an uid-like id.
    //
    // Follow this path for discussions & solutions:
    // @see http://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid-in-javascript
    // @see http://github.com/broofa/node-uuid
    // @see http://gist.github.com/982883

    guid: function () {

      return (""+1e7+-1e3+-4e3+-8e3+-1e11).replace(/1|0/g,function(){return(0|Math.random()*16).toString(16)}); // Credits to subzey
    }
  };
});
