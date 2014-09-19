<?php

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

/**
 * Flatten page tree & set ids and
 * parent/child relations.
 *
 * @todo Refactor into a controller.
 */
function flattenPages (Array $pages) {

    $flat  = array();
    $queue = $pages;

    $id    = 0;

    while(count($queue) > 0)
    {
        $current       = array_shift($queue);
        $current['id'] = $id;

        $id++;

        if (isset($current['pages'])) {

            $current['children'] = true;

            foreach ($current['pages'] as $value) {

                $value['parent'] = $current['id'];

                // Push children back to queue
                array_unshift($queue, $value);
            }

            unset($current['pages']);
        }

        $flat[] = $current;
    }

    return $flat;
}

