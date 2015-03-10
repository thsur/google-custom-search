<?php

namespace App\Service;

use \Google_Client;
use \Google_Service_Customsearch;

/**
 * Using Google's Custom Search Engine API:
 *
 * 1. Make sure to enable the Custom Search API in Google's Developers Console.
 * 2. Setup a custom search engine.
 *
 * Introduction & general how to:
 * https://developers.google.com/custom-search/json-api/v1/introduction
 *
 * How to search the entire web with a custom search:
 * https://support.google.com/customsearch/answer/2631040
 *
 * How to issue a query and its results:
 * https://developers.google.com/custom-search/json-api/v1/using_rest
 *
 * Performance tips:
 * https://developers.google.com/custom-search/json-api/v1/performance
 *
 */
class GoogleSearch {

    /**
     * Custom search engine
     *
     * @var Google_Service_Customsearch_Cse_Resource
     */
    protected $cse;

    /**
     * @var Google_Service_Customsearch
     */
    protected $service;

    /**
     * Default search engine options
     *
     * @var Array
     */
    protected $options;

    /**
     * Do a custom query.
     *
     * @param  String - Query
     * @param  Array  - Options
     * @return Array
     */
    public function query($query, Array $options = array()) {

        $options = array_merge($this->options, $options);
        $result  = $this->service->cse->listCse($query, $options);

        return $result->offsetGet('modelData');
    }

    /**
     * @param Google_Client
     * @param String  - Custom search engine id
     * @param Array   - Default search options
     */
    public function __construct(Google_Client $client, $cse_id, Array $options = array()) {

        $this->service = new \Google_Service_Customsearch($client);
        $this->options = array_merge(array(

            'cx'     => $cse_id,
            'fields' => 'queries,searchInformation,items(title,link,displayLink,snippet,formattedUrl)'

        ), $options);
    }
}
