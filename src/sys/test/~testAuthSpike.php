<?php

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

echo curlUsingGet($url.'/private');