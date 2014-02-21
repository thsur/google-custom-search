'use strict;'

angular.module('messages').service('Messages', function () {

  var messages = [];

  this.add = function (message) {

    messages.push(message);
  };

  this.getAll = function () {

    return messages;
  };
});
