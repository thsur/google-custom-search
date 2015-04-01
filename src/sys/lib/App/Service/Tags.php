<?php

namespace App\Service;

/**
 * Handle tags.
 */
class Tags{

    /**
     * @var FileStorage
     */
    protected $storage;

    /**
     * Name of tag file
     *
     * @var String
     */
    protected $tagfile;

    /**
     * List of tags
     *
     * @var Array
     */
    protected $tags = array();

    /**
     * Get tags
     *
     * @param  String - fetch tags that belong to the given key (optional)
     * @return Array
     */
    public function get($key = null) {

        if ($key) {

            return isset($this->tags[$key]) ? $this->tags[$key] : array();
        }

        return $this->tags;
    }

    /**
     * Set a tag
     *
     * @param  String - key the tag should be assigned to
     * @param  String - the tag
     */
    public function set($key, $tag) {

        $valid = preg_match('/^\w+$/', $tag);

        if ($valid) {

            if (!isset($this->tags[$key])) {

                $this->tags[$key] = array();
            }

            if (!in_array($tag, $this->tags[$key])) {

                $this->tags[$key][] = $tag;
                $this->storage->write($this->tagfile, $this->tags, true);
            }
        }
    }

    /**
     * Remove a key or a tag inside a key
     *
     * @param  String - key to be removed
     * @param  String - tag to be removed (optional)
     */
    public function remove($key, $tag = null) {

        $valid = preg_match('/^\w+$/', $tag);

        if ($tag && !in_array($tag, $this->tags[$key])) {

            unset($this->tags[$key][$tag]);
            $this->storage->write($this->tagfile, $this->tags, true);
        }
        elseif ($key && isset($this->tags[$key])) {

            unset($this->tags[$key]);
            $this->storage->write($this->tagfile, $this->tags, true);
        }
    }

    /**
     * @param String $storage_path - where to look for files
     */
    public function __construct(FileStorage $storage, $tagfile) {

        $this->storage = $storage;
        $this->tagfile = $tagfile;
        $this->tags    = $this->storage->get($this->tagfile);
    }
}

