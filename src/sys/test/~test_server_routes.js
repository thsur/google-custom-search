
var _ = require('underscore');
var http = require('http');
var querystring = require('querystring');

var connect = {

 host: 'localhost',
 port: 80,
 //api: '/_tinlizzy/src/sys/test/spikes/authentication.php'
 api: '/_tinlizzy/src/sys/test/server.php'
};

var send_request = function (options, data) {

  if (data) {

    data = querystring.stringify(data);
    options.headers = {

        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': data.length
    }
  }

  var request = http.request(options, function (result) {

    console.log('\n' + result.req._header.trim() + '\n');

    result.setEncoding('utf8');

    console.log('STATUS: '  + result.statusCode);
    console.log('HEADERS: ' + JSON.stringify(result.headers));

    result.on('data', function (chunk) {

      console.log('BODY: ' + chunk);
    });
  });

  request.on('error', function(e) {

    console.log('problem with request: ' + e.message);
  });

  if (data) {

    request.write(data);
  }

  request.end();
}

var options = {

  hostname: connect.host,
  port: connect.port,
  path: connect.api,
  method: 'GET'
};

send_request(_.extend({}, options, {path: options.path + '/'}));
send_request(_.extend({}, options, {path: options.path + '/public'}));
send_request(_.extend({}, options, {path: options.path + '/login'}));
send_request(_.extend({}, options, {path: options.path + '/private/logout'}));
send_request(_.extend({}, options, {path: options.path + '/private'}));
send_request(_.extend({}, options, {path: options.path + '/private/honeypot'}));

send_request(_.extend({}, options, {method: 'POST', path: options.path + '/private/login_check'}), { _username: 'admin', _password: 'foo' });
