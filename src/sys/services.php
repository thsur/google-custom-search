<?php

use Symfony\Component\Yaml\Yaml;
use Symfony\Component\Finder\Finder;

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
             ->name('/^'.$name.'[.](json|yaml)$/');

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
     * extension of the given file (yaml|json).
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

/**
 * Page tree(s) helper.
 */

class Pages{

    public function flatten(Array $pages){

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
}

/**
 * Array filter functions.
 */
class Filter{

    public function keep_matching(Array $set, Array $keys){

        $filter = array_flip($keys);

        array_walk($set, function (&$entry) use ($filter) {

            $entry = array_intersect_key($entry, $filter);
        });

        return $set;
    }

    public function remove_matching(Array $set, Array $keys){

        $filter = array_flip($keys);

        array_walk($set, function (&$entry) use ($filter) {

            $entry = array_diff_key($entry, $filter);
        });

        return $set;
    }
}
