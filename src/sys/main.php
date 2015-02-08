<?php

namespace Crawler;

/**
 * Bootstrap
 */

if (!defined('__STORAGE__')) {

    define('__STORAGE__', dirname(__DIR__).'/storage');
}

require_once 'vendor/autoload.php';
require_once 'lib/schema.php';

// Dependencies

use \Silex\Application;
use \Symfony\Component\HttpFoundation\Response;
use \Symfony\Component\HttpFoundation\Request;
use \Symfony\Component\HttpKernel\HttpKernelInterface;
use Symfony\Component\Yaml\Yaml;
use \Google_Client;

/**
 * App
 */

$app = new Application();

// Config

$config = Yaml::parse(file_get_contents(__STORAGE__.'/config.sample.yml'));

foreach ($config as $key => $value) {

    $app['config.'.$key] = $value;
}

// Setup db & provide db handles

$handles = Schema\setup(__STORAGE__);

$app['dbs'] = $app->share(function ($app) use ($handles) {

    $dbs = new \StdClass();

    foreach ($handles as $dbname => $handle) {

        $dbname         = pathinfo($dbname, PATHINFO_FILENAME);
        $dbs->{$dbname} = $handle;
    }

    return $dbs;
});

// Bind services

$app['search'] = $app->share(function ($app) {

    $client = new Google_Client();
    $client->setDeveloperKey($app['config.Google_API_Key']);

    return new Service\GoogleSearch($client, $app['config.Google_CSE_Key']);
});

$app['storage'] = $app->share(function () {

    return new Service\FileStorage(__STORAGE__);
});

$app['error'] = $app->share(function ($app) {

    return new Service\Error($app);
});

// Manually boot all service providers so we can use them
// outside of a handled request, if we need/want to.

$app->boot();

// JSON middleware
// Cf. http://silex.sensiolabs.org/doc/cookbook/json_request_body.html

$app->before(function (Request $request) {

    if (0 === strpos($request->headers->get('Content-Type'), 'application/json')) {

        $data = json_decode($request->getContent(), true);
        $request->request->replace(is_array($data) ? $data : array());
    }
});

// Google Search

$app->post('/search/google', function (Application $app, Request $request) {

    $query   = $request->get('query');
    $results = $app['search']->query($query);

    // Insert into db

    $bind = array(

        ':query'    => $app->escape($query),
        ':hash'     => md5($query),
        ':queries'  => json_encode($results['queries']), // 'nextPage','previousPage,'request'
        ':info'     => json_encode($results['searchInformation']), // 'totalResults','formattedTotalResults'
        ':items'    => json_encode($results['items'])
    );

    $vals = implode(',', array_keys($bind));
    $cols = str_replace(':', '', $vals);

    $db   = $app['dbs']->queries;
    $sql  = "insert into raw({$cols}) values({$vals})";

    $db->query($sql, $bind);

    return $app->json(null, 201); // 201 created
});

$app->get('/search/google/get/{hash}', function (Application $app, $hash) {

    $db     = $app['dbs']->queries;
    $sql    = "select * from raw where hash = ? and deleted is null limit 1";

    $result = $db->query($sql, array($hash));

    return $app->json($result);
});

$app->get('/search/google/delete/{hash}', function (Application $app, $hash) {

    $db     = $app['dbs']->queries;
    $sql    = "update raw set deleted = 1 where hash = ?";

    $result = $db->query($sql, array($hash));

    return $app->json();
});

$app->get('/search/google/recover/{hash}', function (Application $app, $hash) {

    $db     = $app['dbs']->queries;
    $sql    = "update raw set deleted = null where hash = ?";

    $result = $db->query($sql, array($hash));

    return $app->json();
});

$app->get('/search/google', function (Application $app) {

    $db     = $app['dbs']->queries;
    $sql    = "select hash, query from raw where deleted is null group by hash";

    $result = $db->query($sql);

    return $app->json($result);
});

/**
 * Routes
 */

// Get page tree

$app->get('/routes', function (Application $app) {

    $routes = $app['storage']->get('routes');

    if (!$routes) {

        return sendError();
    }

    $routes = array_pop($routes);

    // Add a default access level if none set

    foreach ($routes as &$route) {

        if (!isset($route['access'])) {

            $route['access'] = null; // @todo Refactor to something real
        }
    }

    return $app->json($routes);
});

// Default, i.e. any other route

$app->match('{url}', function(Application $app, Request $request) {

    //var_dump($request->server->get('argv'), $request->headers, $request->request);

    return $app['error']->send(501);

})->assert('url', '.*');

// Start dispatching incoming requests

if (php_sapi_name() != 'cli') {

    $app->run();
}

