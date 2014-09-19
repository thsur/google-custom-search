
var request = require('request');
var util    = require('util');
var _       = require('underscore');
var lazy    = require('lazy.js');

var jar = request.jar();

var options = {

  //url: 'http://localhost/_tinlizzy/src/sys/test/spikes/authentication.php',
  url: 'http://localhost/_tinlizzy/src/sys/test/server.php',
  json: true,
  jar: jar
};

function log_response (options, error, response) {

  if (error) {

    util.print('Error:' + error);
  }

  var headers = '',
      status;

  if (response) {

    status = response.statusCode;

    for (var field in response.headers) {

      headers += field + ": " + response.headers[field] + "\n";
    }

    util.print(status + "\n" + headers);
  }
}

/*
request(options.url, function (error, response, body) {

  log_response(options, error, response);
});
*/

var opts = _({}).extend(options, {

  url: options.url + '/private',
  method: 'GET',
});


request(opts, function (error, response, body) {

  log_response(options, error, response);
  console.log(body);

  //console.log(response.request);
});

var post_opts = _({}).extend(options, {

  url: options.url + '/private/login_check',
  method: 'POST',
  form: {_username: 'admin', _password: 'foo'},
  jar: jar
});

request(post_opts, function (error, response, body) {

  log_response(options, error, response);
  console.log(body);

  //console.log(response.request);
});

return;

var Client = function (options) {

  this.options = options;
}

Client.prototype.request = function (options, callback) {

  request(options, function (error, response, body) {

    callback(error, response, body);
  });
};

Client.prototype.get = function (path, callback) {

  this.request(this.options, callback);
};

var http = new Client(options);

http.get(options, function (error, response, body) {

    console.log(error);

    if (response) {

      console.log(response.statusCode, response.headers);
    }

  });
return;

///process.exit();

//----------------------------
//

var _ = require('underscore');
var http = require('http');
var querystring = require('querystring');

var connect = {

 host: 'localhost',
 port: 80,
 api: '/_tinlizzy/src/sys/test/spikes/authentication.php'
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
