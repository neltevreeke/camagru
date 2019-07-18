<?php
    class Database {

        // Database parameters
        private $host = "127.0.01";
        private $DB_NAME = "camagru_db";
        private $DB_USER = "root";
        private $DB_PASSWORD = "root";
        private $DB_DSN;
        private $conn;

        // Database connection
        public function connect() {
            $this->conn = null;
            $this->DB_DSN = "mysql:host=" . $this->host . ";dbname=". $this->DB_NAME;

            try {
                $this->conn = new PDO($this->DB_DSN, $this->DB_USER, $this->DB_PASSWORD);
                $this->conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
                echo "Connected successfully\n";
            } catch(PDOException $e) {
                echo "Connection error: " . $e->getMessage();
            }

            return $this->conn;
        }
    }
?>