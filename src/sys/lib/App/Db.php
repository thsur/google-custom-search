<?php

namespace App;

use \SQLite3;
use \InvalidArgumentException;

class Db {

    /**
     * @var SQLite3
     */
    protected $db;

    /**
     * @return Constant
     */
    protected function getParameterType($arg) {

        switch (gettype($arg)){

            case 'double':
                return \SQLITE3_FLOAT;

            case 'integer':
                return \SQLITE3_INTEGER;

            case 'boolean':
                return \SQLITE3_INTEGER;

            case 'NULL':
                return \SQLITE3_NULL;

            case 'string':
                return \SQLITE3_TEXT;

            default:
                throw new InvalidArgumentException('Argument is of invalid type '.gettype($arg));
        }
    }

    /**
     * @return SQLite3Stmt
     */
    protected function bind(\SQLite3Stmt $statement, Array $bind) {

        // Sniff type of bind (positional, named) by first key

        reset($bind);

        $first_key     = key($bind);
        $is_positional = is_integer($first_key);

        // Positional binding starts with 1, so re-index array if necessary

        if ($is_positional && $first_key == 0) {

            $bind = array_combine(range(1, count($bind)), array_values($bind));
        }

        // Do the binding

        foreach ($bind as $key => $value) {

            $type = $this->getParameterType($value);
            $statement->bindValue($key, $value, $type);
        }

        return $statement;
    }

    /**
     * @return Array
     */
    public function getTables() {

        $sql    = "SELECT name FROM sqlite_master WHERE type='table' ORDER BY name;";
        $tables = $this->query($sql);

        foreach ($tables as $key => $table) {

            $tables[$key] = $table['name'];
        }

        return $tables;
    }

    /**
     * @return Array
     */
    public function getInfo($table) {

        $sql = "PRAGMA table_info({$table});";
        return $this->query($sql);
    }

    /**
     * Turns an associative array into an array that can be used
     * with prepared statements.
     *
     * Returns the transformed array plus a column and a value
     * string to use with SQL insert & update queries, depending
     * on the query type given.
     *
     * @param  Array  - data to transform
     * @param  String - query type (update|insert|none)
     * @return Array  - transformed data[, cols[, vals]]
     */
    public function getPrepared(Array $data, $type = null) {

        $bind = array();

        foreach ($data as $key => $value) {

            $bind[':'.$key] = $value;
        }

        if (!$type) {

            return $bind;
        }

        $type = strtolower($type);

        if ($type == 'insert') {

            $vals = implode(',', array_keys($bind));
            $cols = str_replace(':', '', $vals);

            return array($bind, $cols, $vals);
        }

        if ($type == 'update') {

            $cols = array();

            foreach (array_keys($bind) as $key) {

                $cols[] = substr($key, 1).'='.$key;
            }

            $cols = implode(',', $cols);

            return array($bind, $cols);
        }
    }

    /**
     * Returns the id of the last inserted row.
     *
     * @return Int
     */
    public function getLastRowId () {

        return $this->db->lastInsertRowid();
    }

    /**
     * SQLite query wrapper.
     *
     * @return Array|Boolean
     */
    public function query($sql, Array $bind = array()) {

        // Get query type (create, insert, select, ...)

        preg_match_all('/^\w+/', trim($sql), $type);

        if (empty($type)) {

            throw new InvalidArgumentException('Query type not recognized');
        }

        $type  = strtolower($type[0][0]);
        $query = ($type == 'select');

        // Prepare a statement

        $statement = null;

        if (!empty($bind)) {

            $statement = $this->db->prepare($sql);
            $this->bind($statement, $bind);
        }

        // Execute

        if (!$query) {

            return $statement ? $statement->execute() : $this->db->exec($sql);
        }

        $result = $statement ? $statement->execute() : $this->db->query($sql);
        $rows   = array();

        while ($row = $result->fetchArray(\SQLITE3_ASSOC)) {

            $rows[] = $row;
        }

        return $rows;
    }

    public function __construct($dbname) {

        $this->db = new \SQLite3($dbname);
    }
}
