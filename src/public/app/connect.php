<?php

define('__BASE__', __DIR__.'/../..');
define('__SYS__', __BASE__.'/sys');
define('__STORAGE__', __BASE__.'/storage');

// Bootstrap

require_once __BASE__.'/sys/vendor/autoload.php';

// Dependencies

use Symfony\Component\Yaml\Yaml;

// Helper

function getFileContents ($file) {

    $file = __STORAGE__.'/'.$file;

    if(file_exists($file)){

        return file_get_contents($file);
    }
}

function getJSON ($file) {

    $file = getFileContents($file);

    if(!$file){

        return false;
    }

    return json_decode($file);
}

function getYAML ($file) {

    $file = getFileContents($file);

    if(!$file){

        return false;
    }

    return Yaml::parse($file);
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

    // Flatten page tree & set ids and
    // parent/child relations.

    $flat  = array();
    $queue = $pages;

    $id    = 0;

    while(count($queue) > 0)
    {
        $current       = array_shift($queue);
        $current['id'] = $id;

        $id++;

        if (isset($current['pages'])) {

            foreach ($current['pages'] as $value) {

                $value['parent'] = $current['id'];
                array_unshift($queue, $value);
            }

            unset($current['pages']);
        }

        $flat[] = $current;
    }

    return $app->json($flat);
});

// Start dispatching

$app->run();