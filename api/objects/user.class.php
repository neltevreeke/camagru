<?php

class User {
    public $username;
    public $email;
    public $password;
    
    private $conn;
    private $tableName = 'users';

    public function __construct($db) {
        return $this->conn = $db;
    }

    public function create() {
        $this->username = htmlspecialchars(strip_tags($this->username));
        $this->email = htmlspecialchars(strip_tags($this->email));

        $this->password = htmlspecialchars(strip_tags($this->password));
        $hash_password = password_hash($this->password, PASSWORD_BCRYPT);
        $this->password = $hash_password;

        $query = "INSERT INTO " . $this->tableName . "
                (username, email, password, admin)
                VALUES ( ?, ?, ?, 0)";
        $stmt = $this->conn->prepare($query);

        if ($stmt->execute(array($this->username, $this->email, $this->password))) {
            return true;
        }
        return false;
    }
}

?>