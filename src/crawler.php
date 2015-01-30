<?php

namespace Crawler;

require_once 'sys/vendor/autoload.php';

/*

    System

*/

use \Exception;
use \Requests;

class CrawlerException extends Exception {}

/** Http.php **/
/** namespace Crawler/Http; **/

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
    public static function url ($url, $headers = array()) {

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
    public static function multi (Array $urls, $callback) {

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
    public static function data ($url, $data) {

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
    public static function json ($url, $data) {

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
    public static function multi (Array $urls, $callback) {

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

/** Search.php **/
/** namespace Crawler/Search **/

/**
 * @uses Crawler/Http
 */
abstract class Search {

    protected $endpoint;
    protected $query;

    protected abstract function assemble ();

    public function run ($dry = true) {

        $data  = $this->assemble();

        if (!is_array($data)) {

            throw new CrawlerException('Array expected, but not received.');
        }

        $qs    = http_build_query($data);
        $url   = $this->endpoint;

        if (substr($url, -1) != '?' && !parse_url($this->endpoint, PHP_URL_QUERY)) {

            $url .= '?';
        }

        if (!$dry) {

            return Get::url($url.$qs);
        }

        return array($url, $qs);
    }

    public function __construct($query) {

        $this->query = $query;
    }
}

/**
 * @see  http://moz.com/ugc/the-ultimate-guide-to-the-google-search-parameters
 * @see  https://yoast.com/wp-content/uploads/2007/07/google-url-parameters.pdf
 * @see  http://www.google.com/support/enterprise/static/gsa/docs/admin/72/gsa_doc_set/xml_reference/index.html
 */
class GoogleSearch extends Search {

    protected $options = array();

    public function exclude_terms ($exlude) {

        $this->options['as_eq'] = $exlude;
        return $this;
    }

    public function search_site ($site) {

        $this->options['as_sitesearch'] = $site;
        return $this;
    }

    public function find_related_to_site ($site) {

        $this->options['as_rq'] = $site;
        return $this;
    }

    public function from_country ($cc) {

        $this->options['cr'] = $cc; // en|de|fr|es|jp...
        return $this;
    }

    public function language() ($lang) {

        $this->options['lr'] = 'lang_'.$lang; // nl|cs|pl|da|sl...
        return $this;
    }

    public function limit_results ($limit) {

        $this->options['num'] = $limit;
        return $this;
    }

    public function disable_personalization () {

        $this->options['pws'] = 0;
        return $this;
    }

    protected function assemble () {

        // $query = urlencode($query);

        $query = array(

            'q' => $this->query,
        );

        return $query;
    }

    public function __construct($query) {

        parent::__construct($query);

        $this->endpoint     = 'http://www.google.com/search?';
        $this->options['q'] = $query;
    }
}


/*

    Data & Flow

 */

$gs = new GoogleSearch('heinrich-böll-stiftung & so');
$rs = $gs->run();

var_dump($rs);
exit;

// Data

$get = array(

    'http://ryanmccue.info/',
    'http://google.de'
);

// Multi

Get::multi($get, function ($response, $id) {

    var_dump($id);
});