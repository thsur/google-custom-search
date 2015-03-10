<?php

/**
 * @todo Tag-System
 */

namespace App;

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

/*
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

$app['tags'] = $app->share(function ($app) {

    $storage = $app['storage'];
    return new Service\Tags($storage, 'tags');
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

/**
 * Tag routes
 */

// Get all tags

$app->get('/tags', function (Application $app) {

    $result = $app['tags']->get();
    return $app->json($result);
});

// Get tags filed under a key

$app->get('/tags/get/{key}', function (Application $app, $key) {

    $result = array($key => $app['tags']->get($key));
    return $app->json($result);
});

// Set a tag

$app->get('/tags/set/{key}/{tag}', function (Application $app, $key, $tag) {

    $app['tags']->set($key, $tag);
    return $app->json();
});

// Remove a tag

$app->get('/tags/remove/{key}/{tag}', function (Application $app, $key, $tag) {

    $app['tags']->remove($key, $tag);
    return $app->json();
});

// Remove a key

$app->get('/tags/remove/{key}', function (Application $app, $key) {

    $app['tags']->remove($key);
    return $app->json();
});

/**
 * Google routes
 */

// Do a Google search and store the results

$app->post('/search/google', function (Application $app, Request $request) {

    $query = trim($request->get('query'));
    $hash  = sha1($query);

    // If we already have a query, return its results

    $get = function ($hash) use ($app) {

        $request  = Request::create('/search/'.$hash, 'GET');
        $response = $app->handle($request, HttpKernelInterface::SUB_REQUEST, false);
        $data     = json_decode($response->getContent());

        return array($response, $data);
    };

    list($response, $data) = $get($hash);

    if (count($data)) {

        return $response;
    }

    // Otherwise, start a new search

    $results = $app['search']->query($query);

    // Insert into db

    $db   = $app['dbs']->queries;
    $data = array(

        'query'    => $app->escape($query),
        'hash'     => $hash,
        'queries'  => json_encode($results['queries']), // 'nextPage','previousPage,'request'
        'info'     => json_encode($results['searchInformation']), // 'totalResults','formattedTotalResults'
        'items'    => json_encode($results['items'])
    );

    list($prepared, $cols, $vals) = $db->getPrepared($data, 'insert');

    $sql  = "insert into queries({$cols}) values({$vals})";
    $db->query($sql, $prepared);

    list($response, $data) = $get($hash);
    return $response;
});

// Get all saved searches

$app->get('/search/all', function (Application $app) {

    $db     = $app['dbs']->queries;
    $sql    = "select hash, query from queries where deleted is null group by hash";

    $result = $db->query($sql);

    return $app->json($result);
});

// Mark a saved search as deleted

$app->get('/search/delete/{hash}', function (Application $app, $hash) {

    $db     = $app['dbs']->queries;
    $sql    = "update queries set deleted = 1 where hash = ?";

    $result = $db->query($sql, array($hash));

    return $app->json();
});

// Un-delete a saved search

$app->get('/search/recover/{hash}', function (Application $app, $hash) {

    $db     = $app['dbs']->queries;
    $sql    = "update queries set deleted = null where hash = ?";

    $result = $db->query($sql, array($hash));

    return $app->json();
});

// Update a search

$app->post('/search/update', function (Application $app, Request $request) {

    $data = $request->request->all();
    $db   = $app['dbs']->queries;

    $id   = $data['id'];
    unset($data['id']);

    list($prepared, $cols) = $db->getPrepared($data, 'update');

    $sql  = "update queries set {$cols} where id = {$id}";
    $db->query($sql, $prepared);

    return $app->json();
});

// Get a saved search

$app->get('/search/{hash}', function (Application $app, $hash) {

    $db     = $app['dbs']->queries;
    $sql    = "select * from queries where hash = ? and deleted is null limit 1";

    $result = $db->query($sql, array($hash));

    return $app->json($result);
});

/**
 * Core routes
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

/**
 * Main
 */

if (php_sapi_name() != 'cli') {

    // Start dispatching incoming requests
    $app->run();
}

