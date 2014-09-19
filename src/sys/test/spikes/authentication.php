<?php

/**
 * Form based login without a server-side form.
 *
 * Like when you do some XHR/REST/etc. stuff and want
 * to have a user/session based auth management rather
 * than, say, HTTP Auth.
 *
 * Reads:
 *
 * http://silex.sensiolabs.org/doc/providers/security.html
 * http://symfony.com/doc/current/cookbook/security/
 *
 * http://symfony.com/doc/current/book/security.html
 * http://symfony.com/doc/current/components/security/firewall.html
 * http://symfony.com/doc/current/reference/configuration/security.html
 * http://symfony.com/doc/current/cookbook/security/form_login.html
 * https://github.com/gonzalo123/silexSecurity
 *
 * Classes:
 *
 * Silex\Provider\SecurityServiceProvider
 * Symfony\Component\Security\Core\SecurityContext
 * Symfony\Component\Security\Core\SecurityContextInterface
 * Symfony\Component\Security\Http\Firewall\LogoutListener
 */

/**
 * Bootstrap
 */

define('__BASE__', dirname(dirname(dirname(__DIR__))));
define('__SYS__', __BASE__.'/sys');

require_once __SYS__.'/vendor/autoload.php';

// Dependencies

use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Security\Core\SecurityContext;
use Symfony\Component\Security\Http\Logout\DefaultLogoutSuccessHandler;

/**
 * Setup
 */

$app = new Silex\Application();

if(true){

    $app['debug'] = true;
}

// Handle exceptions - might come in handy for dealing
// with possible exceptions thrown on logout (unless
// you have PHP >= 5.4.11 installed, see notes on the
// firewall's "logout" section below).

$app->error(function (Exception $e, $code) {

    exit();
});

// Enable logging

$app->register(new Silex\Provider\MonologServiceProvider(), array(

    'monolog.logfile' => __DIR__.'/development.log', // Make sure to create the file first
));

// Configure security

$app->register(new Silex\Provider\SecurityServiceProvider());
$app->register(new Silex\Provider\SessionServiceProvider());

$app['security.firewalls'] = array(

    // Give login its own rule set to avoid any conflicts.
    // See 'Avoid common pitfalls' section in docs.
    'login' => array(

        'pattern'   => '^/login$',
        'anonymous' => array(), // Login is open to the public
    ),
    'api' => array(

        'pattern' => '^/private',
        'form' => array(

            'login_path' => '/login',

            // We don't need to define this, but we need to make sure it's
            // protected (so it gets intercepted).
            'check_path' => '/private/login_check',

            // Don't do a 302 redirect, just forward all action to
            // the login route.
            'use_forward' =>  true,

            // Same here.
            //'failure_forward' => true,

            // When there's no URL to redirect to after a successful login,
            // redirect here.
            'default_target_path' => '/', // Actually the default value, so we could
                                          // have omitted the whole line.
         ),
        'logout' => array(

            // Again, we don't have to implement this. Though we're
            // intercepting the process, see below.
            //
            // IMPORTANT notice:
            //
            // PHP might throw a Session Exception when calling
            // the logout route - this has nothing to do with
            // Symfony or Silex, but with PHP itself.
            //
            // You MUST upgrade to PHP >= 5.4.11 at least.
            //
            // @see http://stackoverflow.com/a/18383284

            'logout_path' => '/private/logout'
        ),
        'users' => array( // For a possible user provider lib, see https://github.com/jasongrimes/silex-simpleuser

            // raw password is foo
            'admin' => array('ROLE_ADMIN', '5FZ2Z8QIkA7UTZ4BYkoC+GsReLf569mSKDsfods6LYQ8t+a8EW9oaircfMpmaLbPBh4FOBiiFyLfuZmTSUwzZg=='),
        ),
    ),
);

// Define a custom logout handler to prevent redirection.

class CustomLogoutSuccessHandler extends DefaultLogoutSuccessHandler
{
    public function onLogoutSuccess(Request $request)
    {
        return new Response(null, Response::HTTP_OK);
    }
}

// Watch out for '.api' - the key we need here is the key identifying the
// corresponding firewall.

$app['security.authentication.logout_handler.api'] = $app->share(function () use ($app) {

    return new CustomLogoutSuccessHandler($app['security.http_utils']);
});

// $app->register(new Silex\Provider\SessionServiceProvider());
// $app['session']->start();

// Manually boot all service providers so we can use them
// outside of a handled request, if we need/want to.

$app->boot();

/**
 * Routes
 */

// Silex/Symfony redirects after a successful login, but might find no
// valid request to redirect to, in which case it would redirect to
// its default target route. So we better implement it. Voilà.
//
// For a discussion & more involved solutions, cf.:
// @see http://symfony.com/doc/current/cookbook/security/form_login.html
// @see http://symfony.com/doc/current/cookbook/security/target_path.html

$app->get('/', function (Request $request) use ($app) {

    return new Response(null, Response::HTTP_OK);
});

/**
 * Login
 */

$app->get('/login', function (Request $request) use ($app) {

    $response = new Response();
    $session  = $request->getSession();

    // Login route allows for anonymous access, in which case a login token
    // is set. This marks a direct hit, so ignore it.

    $token = $app['security']->getToken();

    if ($token) {

        return $response;
    }

    // Now we're sure it's a forward from either the login check or
    // another protected route, let's check for errors.

    $error     = null;
    $error_key = SecurityContext::AUTHENTICATION_ERROR;

    if ($request->attributes->has($error_key)) {

        $error = $request->attributes->get($error_key);

    } else {

        $error = $session->get($error_key);
        $session->remove($error_key);
    }

    if (!$error) {

        // Some protected route was hit. Signal back a 401, for
        // example to trigger a login form.

        $response->setStatusCode(Response::HTTP_UNAUTHORIZED);
    }
    else {

        //var_dump($session->get(SecurityContext::LAST_USERNAME));

        // The login check route was hit, so a login attempt
        // occured, but didn't succeed.

        $response->setStatusCode(Response::HTTP_FORBIDDEN);
    }

    return $response;
});

/**
 * Public
 */

$app->get('/public', function () use ($app) {

    return 'GET public';
});

/**
 * Private
 */

$app->get('/private', function () use ($app) {

    return 'GET private';
});

$app->get('/private/honeypot', function () use ($app) {

    return 'GET honeypot';
});

// Start dispatching

$app->run();
