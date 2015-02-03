<?php

namespace Crawler;

use Symfony\Component\Yaml\Yaml;
use Symfony\Component\Finder\Finder;

use \Google_Client;
use \Google_Service_Customsearch;

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

        $filtered = array(

            'result'  => $result->getSearchInformation(),
            'queries' => $result->getQueries(),
            'items'   => $result->getItems()
        );

        return $filtered;
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

/**
 * Handle stored files.
 */
class FileStorage{

    /**
     * File system helper
     *
     * @var Symfony\Component\Finder\Finder
     */
    protected $finder = null;

    /**
     * Read contents of a file.
     *
     * @param  String $file - file name *without* extension
     * @return Array        - contents, file extension
     */
    protected function read($name){

        $this->finder
             ->files()
             ->name('/^'.$name.'[.](json|yml|yaml)$/');

        foreach ($this->finder as $file) {

            return array(

                'contents' => $file->getContents(),
                'type' => $file->getExtension()
            );
        }
    }

    /**
     * Get something from storage, in this case a file.
     *
     * Returns parsed YAML or JSON, depending on the
     * extension of the given file (yml|yaml|json).
     *
     * @param  String $name - a file name *without* extension
     * @return String
     */
    public function get($name){

        $result = $this->read($name);

        if(!$result){

            return false;
        }

        switch ($result['type']) {
            case 'yml':
            case 'yaml':
                return Yaml::parse($result['contents']);
                break;

            case 'json':
                return json_decode($result['contents']);
                break;
        }
    }

    /**
     * @param String $storage_path - where to look for files
     */
    public function __construct($storage_path){

        $this->finder  = new Finder();
        $this->finder->in($storage_path.'/');
    }
}
