<?php

/**
 * Bootstrap
 */

define('__BASE__', dirname(dirname(__DIR__)));
define('__SYS__', __BASE__.'/sys');
define('__STORAGE__', __BASE__.'/storage');

require_once __BASE__.'/sys/vendor/autoload.php';

// Dependencies

use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\Request;

require_once __BASE__.'/sys/functions.php';
require_once __BASE__.'/sys/services.php';

/**
 * App
 */

$app = new Silex\Application();

if(true){

    $app['debug'] = true;
}

// Bind service providers

$app->register(new Silex\Provider\SecurityServiceProvider());
$app->register(new Silex\Provider\SessionServiceProvider());

$app['security.firewalls'] = array(

    'protected' => array(

        'pattern' => '^/',
        'form_login' => array(

             'login_path' => '/login',
             'check_path' => '/login'
         ),
        'users' => array(

            // raw password is foo
            'admin' => array('ROLE_ADMIN', '5FZ2Z8QIkA7UTZ4BYkoC+GsReLf569mSKDsfods6LYQ8t+a8EW9oaircfMpmaLbPBh4FOBiiFyLfuZmTSUwzZg=='),
        ),
    ),
);

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