<?php

/**
 * @usage Http\Get::url("http://example.com/");
 */

namespace Crawler\Http;

use \Requests;
use \Exception;

class HttpException extends Exception {}

class Http {

    private function __construct() {}
}

class Get extends Http {

    protected static $options = array(

        'single' => array('headers' => array('Accept' => 'text/html')),
        'multi'  => array('type' => Requests::GET,
                          'headers' => array('Accept' => 'text/html'))
    );

    /**
     * @return Requests_Response
     */
    public static function url($url, $headers = array()) {

        $headers  = empty($headers) ? self::$options['single']['headers'] : $headers;
        $response = null;

        try {

            $response = Requests::get($url, $headers);

        } catch (Exception $e) {

            $response = $e;
        }

        return $response;
    }

    /**
     * @param  Array    - $urls
     * @param  Function - $callback
     * @return Array    - Requests_Response|Requests_Exception, $urls array id
     */
    public static function multi(Array $urls, $callback) {

        $requests = array();

        foreach ($urls as $url) {

            $requests[] = array_merge(array('url' => $url), self::$options['multi']);
        }

        Requests::request_multiple($requests, array('complete' => function ($response, $id) use ($callback) {

            if (is_callable($callback)) {

                $callback($response, $id);
            }
        }));
    }
}

class Post extends Http {

    protected static $headers = array(

        'default'=> array(),
        'json'   => array('Content-Type' => 'application/json')
    );

    protected static $options = array(

        'multi' => array('type' => Requests::POST)
    );

    /**
     * @return Requests_Response|Requests_Exception
     */
    public static function data($url, $data) {

        $response = null;

        try {

            $response = Requests::post($url, self::$headers['default'], $data);

        } catch (Exception $e) {

            $response = $e;
        }

        return $response;
    }

    /**
     * @return Requests_Response|Requests_Exception
     */
    public static function json($url, $data) {

        $response = null;

        try {

            $response = Requests::post($url, array_merge(self::$headers['default'], self::$headers['json']), $data);

        } catch (Exception $e) {

            $response = $e;
        }

        return $response;
    }

    /**
     * @param  Array    - $urls, each entry containing: ('url' => ..., 'data' => array(...) [, 'json' => true])
     * @param  Function - $callback
     * @return Array    - Requests_Response|Requests_Exception, $urls array id
     */
    public static function multi(Array $urls, $callback) {

        $requests = array();

        foreach ($urls as $info) {

            $request = array_merge(self::$options['multi'], array(

                'url' => $info['url'],
                'data' => $info['data']
            ));

            if (isset($info['json']) && $info['json']) {

                $request['headers'] = array_merge(self::$headers['default'], self::$headers['json']);
            }
            else {

                $request['headers'] = self::$headers['default'];
            }

            $requests[] = $request;
        }

        Requests::request_multiple($requests, array('complete' => function ($response, $id) use ($callback) {

            if (is_callable($callback)) {

                $callback($response, $id);
            }
        }));
    }
}
