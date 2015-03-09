<?php

if (!defined('__APP__')) {

    define('__APP__', dirname(__DIR__));
}

require_once __APP__.'/vendor/autoload.php';

use Silex\WebTestCase;

class SearchTest extends WebTestCase {

    protected $query;
    protected $hash;

    public function createApplication() {

        require __APP__.'/main.php';

        $app['debug'] = true;
        $app['exception_handler']->disable();

        return $app;
    }

    public function setUp() {

        $this->query = 'Henry David Thoreau';
        $this->hash  = sha1($this->query);

        parent::setUp();
    }

    public function testDoGoogleSearch() {

        $client  = $this->createClient();
        $client->request(

            'GET',
            '/search/'.$this->hash
        );

        $response = $client->getResponse();
        $result   = json_decode($response->getContent(), true);

        if (!empty($result)) {

            // Rather costly test, so better skip if we already have data
            $this->markTestSkipped();
        }

        $client  = $this->createClient();
        $client->request(

            'POST',
            '/search/google',
            array(),
            array(),
            array('CONTENT_TYPE' => 'application/json'),
            '{"query":"'.$this->query.'"}'
        );

        $response = $client->getResponse();
        $status   = $response->getStatusCode();
        $content  = json_decode($response->getContent(), true);

        $this->assertEquals(200, $status);
    }

    public function testGetSavedSearch() {

        $client  = $this->createClient();
        $client->request(

            'GET',
            '/search/'.$this->hash
        );

        $response = $client->getResponse();
        $result   = json_decode($response->getContent(), true);
        $data     = array_pop($result);

        $this->assertTrue(is_array($data));

        $this->assertArrayHasKey('hash', $data);
        $this->assertArrayHasKey('query', $data);
        $this->assertArrayHasKey('queries', $data);
        $this->assertArrayHasKey('info', $data);
        $this->assertArrayHasKey('items', $data);

        $this->assertEquals($this->hash, $data['hash']);
        $this->assertEquals($this->query, $data['query']);
        $this->assertFalse(empty($data['items']));
    }

    /**
     * @depends testGetSavedSearch
     */
    public function testGetAllSearches() {

        $client  = $this->createClient();
        $client->request(

            'GET',
            '/search/all'
        );

        $response = $client->getResponse();
        $result   = json_decode($response->getContent(), true);

        $hashes = array();

        foreach ($result as $row => $set) {

            $hashes[] = $set['hash'];
        }

        $this->assertArrayHasKey('hash', $set);
        $this->assertArrayHasKey('query', $set);

        $this->assertContains($this->hash, $hashes);
        $this->assertEquals(array_unique($hashes), $hashes);
    }

    /**
     * @depends testGetSavedSearch
     */
    public function testDeleteSearch() {

        $client  = $this->createClient();
        $client->request(

            'GET',
            '/search/delete/'.$this->hash
        );

        $response = $client->getResponse();
        $status   = $response->getStatusCode();

        $this->assertEquals(200, $status);

        $client->request(

            'GET',
            '/search/'.$this->hash
        );

        $response = $client->getResponse();
        $result   = json_decode($response->getContent(), true);

        $this->assertEmpty($result);
    }

    /**
     * @depends testGetSavedSearch
     */
    public function testRecoverDeletedSearch() {

        $client  = $this->createClient();
        $client->request(

            'GET',
            '/search/recover/'.$this->hash
        );

        $response = $client->getResponse();
        $status   = $response->getStatusCode();

        $this->assertEquals(200, $status);

        $client->request(

            'GET',
            '/search/'.$this->hash
        );

        $response = $client->getResponse();
        $result   = json_decode($response->getContent(), true);
        $data     = array_pop($result);

        $this->assertTrue(is_array($data));

        $this->assertArrayHasKey('hash', $data);
        $this->assertEquals($this->hash, $data['hash']);
    }
}

