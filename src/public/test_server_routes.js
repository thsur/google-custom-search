
var http = require('http');
var connect = {

 host: 'tin-lizzy',
 port: 80,
 api: '/app/connect.php'
};


var options = {

  hostname: connect.host,
  port: connect.port,
  path: connect.api + '/login',
  method: 'POST'
};

var request = http.request(options, function (result) {

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

request.write('data\n');
request.write('data\n');
request.end();
