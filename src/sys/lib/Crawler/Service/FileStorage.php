<?php

namespace Crawler\Service;

use Symfony\Component\Yaml\Yaml;
use Symfony\Component\Yaml\Dumper;
use Symfony\Component\Finder\Finder;
use Symfony\Component\Filesystem\Filesystem;
use Symfony\Component\Filesystem\Exception\IOExceptionInterface;

/**
 * Handle stored files.
 */
class FileStorage{

    /**
     * Path to storage
     *
     * @var String
     */

    protected $storage;

    /**
     * Allowed file types
     *
     * @var String
     */
    protected $filemask = '[.](json|yml|yaml)$';

    /**
     * File system helper
     *
     * @var Symfony\Component\Finder\Finder
     */
    protected $finder = null;

    /**
     * Get storage, i.e. the storage path including
     * any paths found in name, if given.
     *
     * @var String
     */
    protected function getStorage($name = null) {

        $path = $this->storage;

        if (!$name || strpos($name, '/') === false) {

            return $path;
        }

        $name = ltrim($name, '/');

        if (substr($name, -1) != '/') {

            return $path .'/'.dirname($name);
        }
        else {

            return $path.'/'.$name;
        }
    }

    /**
     * Get something from storage.
     *
     * Returns parsed YAML or JSON, depending on the
     * type of the first found file that matches
     * the given name.
     *
     * @param  String - a file name *without* extension
     * @return Array  - contents
     */
    public function get($name){

        $path = $this->getStorage($name);
        $name = basename($name);

        $this->finder
             ->in($path)
             ->files()
             ->name('/^'.$name.$this->filemask.'/');

        foreach ($this->finder as $file) {

            switch ($file->getExtension()) {

                case 'yml':
                case 'yaml':
                    return Yaml::parse($file->getContents());

                case 'json':
                    return json_decode($file->getContents());

                default:
                    return false;
            }
        }
    }

    /**
     * Get all records from storage found inside given path.
     *
     * @param  String - a relative path
     * @return Array  - found records a.k.a files
     */
    public function getAll($name){

        if (substr($name, -1) != '/') {

            $name .= '/';
        }

        $path = $this->getStorage($name);

        $this->finder
             ->in($path)
             ->files()
             ->name('/'.$this->filemask.'/');

        $records = array();

        foreach ($this->finder as $file) {

            $key   = pathinfo($file->getFilename(), PATHINFO_FILENAME);
            $value = $name.$key;

            $records[$key] = $value;
        }

        return $records;
    }

    /**
     * Write an array as YAML into a file.
     *
     * @param  String $file - file name *without* extension
     * @return Array        - array of contents
     */
    public function write($name, Array $contents){

        $fs   = new Filesystem();
        $path = $this->getStorage($name);

        // Check and assemble file path.

        if (!$fs->exists($path)) {

            $fs->mkdir($path);
        }

        $file = $path.DIRECTORY_SEPARATOR.pathinfo($name, PATHINFO_FILENAME).'.yml';

        // Contents to YAML

        $dumper = new Dumper();
        $yaml   = $dumper->dump($contents);

        // Write it out

        $fs->dumpFile($file, $yaml);
    }

    /**
     * @param String $storage_path - where to look for files
     */
    public function __construct($storage_path){

        $this->storage = $storage_path;
        $this->finder  = new Finder();
    }
}

