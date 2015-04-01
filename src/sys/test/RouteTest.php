<?php

if (!defined('__APP__')) {

    define('__APP__', dirname(__DIR__));
}

require_once __APP__.'/vendor/autoload.php';

use Silex\WebTestCase;

class RouteTest extends WebTestCase {

    public function createApplication() {

        require __APP__.'/main.php';

        $app['debug'] = true;
        $app['exception_handler']->disable();

        return $app;
    }

    public function testNonExistingRoute() {

        $client  = $this->createClient();
        $crawler = $client->request('GET', '/bogus-'.str_shuffle(implode(range('a', 'z'))));

        $response = $client->getResponse();
        $status   = $response->getStatusCode();
        $content  = json_decode($response->getContent(), true);

        $this->assertEquals(501, $status);
        $this->assertContains('Not Implemented', $content);
    }
}
