<?php

define('__BASE__', __DIR__.'/../..');
define('__SYS__', __BASE__.'/sys');
define('__STORAGE__', __BASE__.'/storage');

// Bootstrap

require_once __BASE__.'/sys/vendor/autoload.php';

// Dependencies

use Symfony\Component\Yaml\Yaml;

// Helper

function getJSON ($file) {

    $data = __STORAGE__.'/'.$file;

    if(!file_exists($data)){

        return false;
    }

    return json_decode(file_get_contents($data));
}

function getYAML ($file) {

    $data = __STORAGE__.'/'.$file;

    if(!file_exists($data)){

        return false;
    }

    return Yaml::parse(file_get_contents($data));
}

function sendError ($message, $status = 404) {

    global $app;

    $error = array('message' => $message);
    return $app->json($error, $status);
}

// App

$app = new Silex\Application();

if(true){

    $app['debug'] = true;
}

// Routes

$app->get('/resource/pages', function () use ($app) {

    $pages = getYAML('pages.yaml');

    if (!$pages) {

        return sendError('no data');
    }

    $flat  = array();
    $queue = $pages;

    while(count($queue) > 0)
    {
        $current = array_shift($queue);

        if (isset($current['pages'])) {

            foreach ($current['pages'] as $value) {

                array_unshift($queue, $value);
            }

            unset($current['pages']);
        }

        $flat[] = $current;
    }

    $send = array(

        'pages'  => $pages,
        'routes' => $flat
    );

    return $app->json($send);
});

// Start dispatching

$app->run();