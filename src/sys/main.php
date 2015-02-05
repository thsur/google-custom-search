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

$config = Yaml::parse(file_get_contents(__STORAGE__.'/config.yml'));

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

// Google Search

// $query = 'Henry David Thoreau';
// $id    = md5($query);

// $results = $app['search']->query($query);
// $app['storage']->write('queries/raw/'.$id, $results);

// $all    = $app['storage']->getAll('queries/raw/');
// $single = $app['storage']->get('queries/raw/'.$id);

// var_dump($all);
// var_dump($single);

// class Query {

//     protected $db;

//     public function __construct($db) {

//         $this->db = $db;
//     }
// }

// var_dump(Http\Get::url("http://example.com/"));
// exit;

$request = new Request(array('query' => 'Henry David Thoreau'));

$query = $request->get('query');
$db    = $app['dbs']->queries;

// $results = $app['search']->query($query);
$results = $app['storage']->get('queries/raw/'.md5($query));

$bind = array(

    ':query'    => $app->escape($query),
    ':hash'     => md5($query),
    ':queries'  => json_encode($results['queries']), // 'nextPage','previousPage,'request'
    ':info'     => json_encode($results['searchInformation']), // 'totalResults','formattedTotalResults'
    ':items'    => json_encode($results['items'])
);

$vals = implode(',', array_keys($bind));
$cols = str_replace(':', '', $vals);

$sql = "insert into raw({$cols}) values({$vals})";
$db->query($sql, $bind);

$sql = "select * from raw";
$r = $db->query($sql);

// var_dump($r);
// exit;

$app->post('/search/google', function (Application $app, Request $request) {

    $request = new Request(array('query' => 'Henry David Thoreau'));

    $query = $request->get('query');
    $query = $app->escape($query);

    $id    = md5($query);

    $db    = $app['dbs']->queries;
    // $db->query($sql);

    // $results = $app['search']->query($query);
    $results = $app['storage']->get('queries/raw/'.$id);

    // $app['storage']->write('queries/raw/'.$id, $results);

    return $app->json(array($results), 201); // 201 created
});

$app->get('/search/google/get/{id}', function (Application $app, $id) {

    return $app->json(null);
});

$app->get('/search/google', function (Application $app, $id) {

    return $app->json(null);

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

