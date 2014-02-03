<?php

define('__BASE__', __DIR__.'/../..');
define('__SYS__', __BASE__.'/sys');
define('__STORAGE__', __BASE__.'/storage');

// Bootstrap

require_once __BASE__.'/sys/vendor/autoload.php';

// Helper

function getJSON($file){

    $data = __STORAGE__.'/'.$file;

    if(!file_exists($data)){

        return false;
    }

    return json_decode(file_get_contents($data));
}

// App

$app = new Silex\Application();

if(true){

    $app['debug'] = true;
}

// Routes

$app->get('/resource/nav', function () use ($app) {

    $data = getJSON('nav.json');

    if (!$data) {

        $error = array('message' => 'No data.');
        return $app->json($error, 404);
    }

    return $app->json($data);
});

// Start dispatching

$app->run();