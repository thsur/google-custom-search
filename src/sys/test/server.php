<?php

class Request {

    public function __construct () {

        // Handle requests like index.php/get/me/something

        $uri  = $_SERVER['REQUEST_URI'];
        $root = basename(__FILE__);

        $this->request = substr($uri, strpos($uri, $root) + strlen($root));
        $this->method  = $_SERVER['REQUEST_METHOD'];
        $this->cookie  = $_COOKIE;
        $this->data    = $_REQUEST;
    }
}

class Response {

    public function send ($status, $data = null, $cookie = null) {

        http_response_code($status);

        if ($cookie) {

            header('Set-Cookie: '.$cookie);
        }

        echo $data;
    }
}

// Dispatch

$Request  = new Request();
$Response = new Response();


$Response->send(404, null, 'cookie=mine');
//$Response->send(404, null);

print_r($Request);
