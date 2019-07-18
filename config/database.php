<?php
    class Database {

        // Database parameters
        private $host = "127.0.0.1";
        private $DB_NAME = "camagru_db";
        private $DB_USER = "nelte";
        private $DB_PASSWORD = "root";
        private $conn;

        // Database connection
        public function connect() {
            $this->conn = null;

            try {
                $this->conn = new PDO("mysql:host=" . $this->host .
                                    ";db_name=" . $this->DB_NAME,
                                    $this->DB_USER,
                                    $this->DB_PASSWORD);
                $this->conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            } catch(PDOException $e) {
                echo "Connection error: " . $e->getMessage();
            }

            return $this->conn;
        }
    }
?>