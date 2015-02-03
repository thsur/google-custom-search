<?php

namespace Crawler;

/**
 * Bootstrap
 */

define('__BASE__', dirname(__DIR__));
define('__STORAGE__', __BASE__.'/storage');

require_once 'vendor/autoload.php';

// Dependencies

use \Silex\Application;
use \Symfony\Component\HttpFoundation\Response;
use \Symfony\Component\HttpFoundation\Request;
use \Google_Client;

require_once 'lib/functions.php';
require_once 'lib/services.php';

/**
 * App
 */

$app = new Application();

// Config

$app['config.Google_API_Key'] = 'AIzaSyCESHNsNG50x8G_ApEgQJXVQ33wqVRFhTc';
$app['config.Google_CSE_Key'] = '008195166369752172142:3p_pf3yx01e';

// Bind services

$app['search'] = $app->share(function ($app) {

    $client = new Google_Client();
    $client->setDeveloperKey($app['config.Google_API_Key']);

    return new GoogleSearch($client, $app['config.Google_CSE_Key']);
});

$app['storage'] = $app->share(function () {

    return new FileStorage(__STORAGE__);
});

// Manually boot all service providers so we can use them
// outside of a handled request, if we need/want to.

$app->boot();


$results = $app['search']->query('Henry David Thoreau');
var_dump($results);
exit;

/**
 * Routes
 */

// Get page tree

$app->get('/routes', function () use ($app) {

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

$app->match('{url}', function() {

    return sendError(501);

})->assert('url', '.*');

// Start dispatching

$app->run();