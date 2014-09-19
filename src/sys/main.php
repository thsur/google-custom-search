<?php

/**
 * Bootstrap
 */

define('__BASE__', dirname(__DIR__));
define('__STORAGE__', __BASE__.'/storage');

require_once 'vendor/autoload.php';

// Dependencies

use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\Request;

require_once 'lib/functions.php';
require_once 'lib/services.php';

/**
 * App
 */

$app = new Silex\Application();

if(true){

    $app['debug'] = true;
}

// Bind services

$app['filter'] = $app->share(function () {

    return new Filter();
});

$app['storage'] = $app->share(function () {

    return new FileStorage(__STORAGE__);
});

$app['pages'] = $app->share(function () {

    return new Pages();
});

/**
 * Authentication
 *
 * We use a user/session-based approach. For a discussion, see:
 * http://stackoverflow.com/questions/319530/restful-authentication
 * https://www.owasp.org/index.php/REST_Security_Cheat_Sheet
 */

// @todo

// Manually boot all service providers so we can use them
// outside of a handled request, if we need/want to.

$app->boot();

/**
 * Routes
 */

// Login

$app->post('/login', function (Request $request) use ($app) {

    $user = array(

        'access' => 'null'
    );

    if(!$user || $user['access'] != 'admin'){

    }

    var_dump($request); exit('##');
    return $app->json($request);

    return sendError(401);
});

// Config data like page tree & stuff

$app->get('/public-config', function () use ($app) {

    $pages = $app['storage']->get('pages');

    if (!$pages) {

        return sendError();
    }

    $pages = array_pop($pages);

    // Flatten page tree & set ids and
    // parent/child relations.

    $flat  = $app['pages']->flatten($pages);

    // Add a default access level if none set

    foreach ($flat as &$page) {

        if (!isset($page['access'])) {

            $page['access'] = null; // @todo Refactor to something real
        }
    }

    // Tailor response

    $send = array();

    $keep_in_pages      = array('id', 'title', 'url', 'parent', 'children', 'access');
    $remove_from_routes = array('id', 'parent', 'children');

    $send['pages']  = $app['filter']->keep_matching($flat, $keep_in_pages);
    $send['routes'] = $app['filter']->remove_matching($flat, $remove_from_routes);

    return $app->json($send);
});

// Default, i.e. any other route

$app->match('{url}', function() {

    return sendError(501);

})->assert('url', '.*');

// Start dispatching

$app->run();