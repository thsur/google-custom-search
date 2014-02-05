
'use strict';

angular.module('hud').service('Hud', function Hud() {

  var messages = [];
  var show     = true;

  this.push = function (what) {

    messages.push(what);
    return this;
  };

  this.clear = function () {

    // We can't just replace the current
    // array with a new one, as this would
    // destroy all references and thus any
    // outside binding to it (via fetchAll,
    // see below).
    messages.splice(0, messages.length);
    return this;
  };

  this.fetchAll = function () {

    return show ? messages : [];
  };

  this.on = function () {

    show = true;
    return this;
  };

  this.off = function () {

    show = false;
    return this;
  };

  this.is_on = function () {

    return show;
  };

  return this;
});
