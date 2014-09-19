
var http      = require('http');
var uri       = require('url');
var util      = require('util');
var stringify = require('querystring').stringify;
var _         = require('underscore');
var needle    = require('needle');

var jar  = '';

var request = function (method, url, data, callback) {

  url  = uri.parse(url);

  if (_.isFunction(data)) {

    callback = data;
    data = null;
  }

  var options = {

    hostname: url.host,
    port: url.port,
    path: url.path,
    method: method.toUpperCase()
  };

  var header = {

    'User-Agent': 'Mozilla/5.0'
  };

  if (data) {

    data = stringify(data);
    header['Content-Length'] = data.length;
  }

  if (options.method === 'POST') {

    header['Content-Type'] = 'application/x-www-form-urlencoded';
  }

  if (jar) {

    header['Cookie'] = jar;
  }

  options.headers = header;

  var request = http.request(options, function (response) {

    response.body = '';
    response.setEncoding('utf8');

    response.on('data', function (chunk) {

        response.body = response.body + chunk;
    });

    response.on('end', function(){

      callback(response);
    });
  });

  request.on('error', function(e) {

    console.warn(e.message);
  });

  if (data) {

    request.write(data);
  }

  request.end();
};

var logger = function (response) {

  if(!response) return;

  var request = response.req._header.trim();
  var status  = response.statusCode;
  var headers = '';

  if (response.headers['set-cookie']) {

    jar = response.headers['set-cookie'][0].split(';')[0];
  }

  for (var field in response.headers) {

    headers += field + ": " + response.headers[field] + "\n";
  }

  util.print(request + "\n\n" + status + " " + http.STATUS_CODES[status] + "\n" + headers);
  util.print(response.body || '');
  util.print("\n\n");
}

var endpoint = 'http://localhost/_tinlizzy/src/sys/test/spikes/authentication.php';
// var endpoint = 'http://localhost/_tinlizzy/src/sys/test/server.php';

// request('get', endpoint + '/public', logger);
 request('get', endpoint + '/private', logger);
 request('get', endpoint + '/private/honeypot', logger);
// request('get', endpoint + '/login', logger);

request('post', endpoint + '/private/login_check', {_username: 'admin', _password: 'foo' }, logger);

