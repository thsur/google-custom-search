<?php

namespace Crawler\Schema;

use Crawler\Db;

global $create; // Required for phpunit, see http://stackoverflow.com/a/9675013
                // See also @backupGlobals in https://phpunit.de/manual/current/en/appendixes.annotations.html

$create = array();

/**
 * @todo  Create table 'queries' (hash, query, deleted)
 * @todo  Rename table 'results' (hash, items)
 * @todo  Create table 'collected' (hash, items)
 * @todo  Create table 'trash' (hash, items)
 */
$create['queries.db']['queries'] = <<<EOT

CREATE TABLE queries(

    id INTEGER,
    query TEXT,
    hash TEXT,
    queries TEXT,
    info TEXT,
    items TEXT,
    collected TEXT,
    trash TEXT,
    deleted INTEGER,
    PRIMARY KEY(id)
);
EOT;

$create['queries.db']['items'] = <<<EOT

CREATE TABLE items(

    id INTEGER,
    PRIMARY KEY(id)
);
EOT;

/**
 * Create missing db's & tables,
 * i.e. setup db structure.
 *
 * @param  String - file system path to the database(s)
 * @return Array  - handles to opened/created databases,
 *                  each entry of type Crawler\Db
 */
function setup($path) {

    global $create;

    $dbs = array();

    foreach ($create as $dbname => $definitions) {

        $db   = new Db($path.'/'.$dbname);
        $info = $db->getTables();

        foreach ($definitions as $table => $sql) {

            if (!in_array($table, $info)) {

                $db->query($sql);
            }
        }

        $dbs[$dbname] = $db;
    }

    unset($create);

    return $dbs;
}
