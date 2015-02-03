<?php

namespace Crawler;

use Symfony\Component\HttpFoundation\Response;

/**
 * Error helper
 *
 * @param  integer $status - HTTP status code
 */
function sendError ($status = 404) {

    global $app;
    return $app->json(array('message' => Response::$statusTexts[$status]), $status);
}

