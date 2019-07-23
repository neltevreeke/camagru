<?php

class User {
    private $username;
    private $emailaddress;
    private $password;
    
    private $conn;
    private $tableName = 'users';

    public function __constructor($db) {
        return $this->conn = $db;
    }

    public function create() {

    }
}

?>