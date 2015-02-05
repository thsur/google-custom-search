<?php

if (!defined('__APP__')) {

    define('__APP__', dirname(__DIR__));
}

require_once __APP__.'/vendor/autoload.php';

use Silex\WebTestCase;

class SearchTest extends WebTestCase {

    public function createApplication() {

        require __APP__.'/main.php';

        ob_start();


        ob_end_clean();

        $app['debug'] = true;
        $app['exception_handler']->disable();

        return $app;
    }

    public function testGoogleSearch() {

        $client  = $this->createClient();
        $crawler = $client->request(

            'POST',
            '/search/google',
            array(),
            array(),
            array('CONTENT_TYPE' => 'application/json'),
            '{"query":"Henry David Thoreau"}'
        );

        $response = $client->getResponse();
        $status   = $response->getStatusCode();
        $content  = json_decode($response->getContent(), true);

        // var_dump($content);

        $this->assertEquals(201, $status);
    }
}

