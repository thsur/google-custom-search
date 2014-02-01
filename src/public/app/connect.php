<?php

// Bootstrap

require_once __DIR__.'/../../sys/vendor/autoload.php';

$app = new Silex\Application();

if(true){

    $app['debug'] = true;
}

// Routes

$app->get('/resource/nav', function () use ($app) {

    $data = array(

        ''          => 'Home',
        'on-text'   => 'Texten',
    );

    if (!$data) {

        $error = array('message' => 'No data.');
        return $app->json($error, 404);
    }

    return $app->json($data);
});

// Start dispatching

$app->run();