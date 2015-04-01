<?php

if (!defined('__APP__')) {

    define('__APP__', dirname(__DIR__));
}

require_once __APP__.'/vendor/autoload.php';

use Silex\WebTestCase;

class TagTest extends WebTestCase {

    public function createApplication() {

        require __APP__.'/main.php';

        $app['debug'] = true;
        $app['exception_handler']->disable();

        return $app;
    }

    public function testSetTags() {

        $client  = $this->createClient();
        $client->request(

            'GET',
            '/tags/set/test/tag'
        );

        $response = $client->getResponse();
        $status   = $response->getStatusCode();

        $this->assertEquals(200, $status);
    }

    /**
     * @depends testSetTags
     */
    public function testGetAllTags() {

        $client  = $this->createClient();
        $client->request(

            'GET',
            '/tags'
        );

        $response = $client->getResponse();
        $data     = json_decode($response->getContent(), true);

        $this->assertArrayHasKey('test', $data);
        $this->assertContains('tag', $data['test']);
    }

    /**
     * @depends testSetTags
     */
    public function testGetAllTagsInsideAKey() {

        $client  = $this->createClient();
        $client->request(

            'GET',
            '/tags/get/test'
        );

        $response = $client->getResponse();
        $data     = json_decode($response->getContent(), true);

        $this->assertArrayHasKey('test', $data);
        $this->assertContains('tag', $data['test']);
    }

    /**
     * @depends testGetAllTagsInsideAKey
     */
    public function testRemoveTag() {

        $client  = $this->createClient();
        $client->request(

            'GET',
            '/tags/remove/test/tag'
        );

        $response = $client->getResponse();
        $data     = json_decode($response->getContent(), true);

        $this->assertFalse(isset($data['test']['tag']));
    }

    /**
     * @depends testRemoveTag
     */
    public function testRemoveKey() {

        $client  = $this->createClient();
        $client->request(

            'GET',
            '/tags/remove/test'
        );

        $response = $client->getResponse();
        $data     = json_decode($response->getContent(), true);

        $this->assertFalse(isset($data['test']));
    }
}

