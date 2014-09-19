<?php

namespace Curl {

    use Curl\Options;

    class Curl {

        public function __construct () {}
    }
}

namespace Curl\Options {

    class Options {

        // @see http://php.net/curl_setopt
        // @see http://curl.haxx.se/libcurl/c/curl_easy_setopt.html

        public $opts = array(

            CURLOPT_URL => null,
            CURLOPT_REFERER => null,
            CURLOPT_USERAGENT => 'curl',

            CURLOPT_HEADER => false,
            CURLOPT_VERBOSE => true,

            CURLOPT_TIMEOUT => 60,
            CURLOPT_RETURNTRANSFER => true, // Get response as string from curl_exec(), don't do any direct output

            CURLOPT_FOLLOWLOCATION => true, // Follow redirects...
            CURLOPT_MAXREDIRS => 3, // ...but not forever

            // Cookies
            //
            // @see http://curl.haxx.se/docs/http-cookies.html

            // CURLOPT_COOKIEJAR
            //
            // Activate cookie engine, and when the handle is closed save all known
            // cookies to the given cookiejar file. Write-only.
            //
            // "Pass a file name (...). This will make libcurl write all internally
            // known cookies to the specified file when curl_easy_cleanup(3) is called.
            // If no cookies are known, no file will be created. Specify "-" to instead
            // have the cookies written to stdout. Using this option also enables cookies
            // for this session, so if you for example follow a location it will make
            // matching cookies get sent accordingly.
            //
            // If the cookie jar file can't be created or written to (...), libcurl will
            // not and cannot report an error for this. Using  CURLOPT_VERBOSE or
            // CURLOPT_DEBUGFUNCTION will get a warning to display, but that is the
            // only visible feedback you get about this possibly lethal situation."
            //
            // http://curl.haxx.se/libcurl/c/curl_easy_setopt.html#CURLOPTCOOKIEJAR

            CURLOPT_COOKIEJAR => null,

            // CURLOPT_COOKIEFILE
            //
            // Activate cookie engine and read the initial set of cookies from the given file.
            // Read-only.
            //
            // "Pass a pointer to a zero terminated string as parameter.
            // It should contain the name of your file holding cookie data to read.
            // (..)
            // Given an empty or non-existing file or by passing the empty string (""),
            // this option will enable cookies for this curl handle, making it understand
            // and parse received cookies and then use matching cookies in future requests.
            //
            // If you use this option multiple times, you just add more files to read.
            // Subsequent files will add more cookies."
            //
            // http://curl.haxx.se/libcurl/c/curl_easy_setopt.html#CURLOPTCOOKIEFILE

            CURLOPT_COOKIEFILE => null, // Specify file for reading, see http://stackoverflow.com/a/10394670

            // POST

            CURLOPT_POST => null,
            CURLOPT_POSTFIELDS => null,

            // How to act when a POST receives a redirect as response.
            //
            // @see http://stackoverflow.com/a/8156808
            // @see http://curl.haxx.se/libcurl/c/curl_easy_setopt.html#CURLOPTPOSTREDIR
            // @see http://evertpot.com/curl-redirect-requestbody/

            CURLOPT_POSTREDIR => 3, // Follow 301 & 302
        );
    }
}

namespace {

    use Curl\Curl;
    use Curl\Options;

    $curl = new Curl();

    class Foo {

        public $CURLOPT_POSTREDIR = 3;
        public $CURLOPT_MAXREDIRS = 5;
    }

    $foo = new Foo();

    foreach ($foo as $key => $value) {

        var_dump($key, $value, constant($key), CURLOPT_MAXREDIRS == constant($key));
    }

    //exit;

    // curl_getinfo($ch);

    // Config

    $url = 'http://localhost/_tinlizzy/src/sys/test/spikes/authentication.php/private/login_check';

    $data = array(

        '_username' => 'admin',
        '_password' => 'foo'
    );

    $cookie_jar = __DIR__.'/tmp/cookie.txt';

    // Get cURL resource

    $curl = curl_init();

    // Set some options - we are passing in a useragent too here
    curl_setopt_array($curl, array(

        CURLOPT_URL => $url,
        CURLOPT_REFERER => $url,
        CURLOPT_USERAGENT => 'curl',

        CURLOPT_HEADER => 1,
        CURLOPT_VERBOSE => 1,

        CURLOPT_COOKIEJAR => $cookie_jar,
        CURLOPT_COOKIEFILE => $cookie_jar, // Specify file for reading, see http://stackoverflow.com/a/10394670
        CURLOPT_COOKIESESSION => 0,

        CURLOPT_FOLLOWLOCATION => 1,
        CURLOPT_RETURNTRANSFER => 1,

        CURLOPT_POST => 1,
        CURLOPT_POSTFIELDS => http_build_query($data),

        // How to act when a POST receives a redirect as response.
        //
        // @see http://stackoverflow.com/a/8156808
        // @see http://curl.haxx.se/libcurl/c/curl_easy_setopt.html#CURLOPTPOSTREDIR
        // @see http://evertpot.com/curl-redirect-requestbody/
        CURLOPT_POSTREDIR => 3,
    ));

    // Send the request & save response to $resp
    $resp = curl_exec($curl);

    // Close request to clear up some resources
    curl_close($curl);

    // Echo response
    print $resp;

    // ------------- //

    $url = 'http://localhost/_tinlizzy/src/sys/test/spikes/authentication.php';

    function curlUsingGet($url, Array $data = array())
    {
        global $cookie_jar;

        $curl = curl_init();

        $data = http_build_query($data);
        $url  = $data ? $url.'?'.$data : $url;

        curl_setopt_array($curl, array(

            CURLOPT_URL => $url,
            CURLOPT_REFERER => $url,
            CURLOPT_USERAGENT => 'curl',

            CURLOPT_HEADER => 1,
            CURLOPT_VERBOSE => 1,

            CURLOPT_COOKIEJAR => $cookie_jar,
            CURLOPT_COOKIEFILE => $cookie_jar, // Specify file for reading, see http://stackoverflow.com/a/10394670
            CURLOPT_COOKIESESSION => 0,

            CURLOPT_FOLLOWLOCATION => 1,
            CURLOPT_RETURNTRANSFER => 1, // Return response instead of printing it to stdout
        ));

        //curl_setopt($curl, CURLOPT_CONNECTTIMEOUT,10); # timeout after 10 seconds, you can increase it

        $return = curl_exec($curl);
        curl_close($curl);

        return $return;
    }

    // echo curlUsingGet($url.'/private');
}
