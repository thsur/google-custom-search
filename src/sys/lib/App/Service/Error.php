<?php

namespace App\Service;

use \Symfony\Component\HttpFoundation\Response;

class Error {

    protected $app;

    public function send($status = 404) {

        return $this->app->json(array('message' => Response::$statusTexts[$status]), $status);
    }

    public function __construct(\Silex\Application $app){

        $this->app = $app;
    }
}