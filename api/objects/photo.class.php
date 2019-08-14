<?php

class Photo {
    public $user_id;
    public $image;

    private $conn;
    private $tableName = 'photos';

    public function __construct($db) {
        return $this->conn = $db;
    }

    public function getPhoto() {
        $query = "SELECT * FROM " . $this->tableName . "
                WHERE userid = ?";
        $stmt = $this->conn->prepare($query);

        $stmt->execute(array($this->user_id));

        if ($stmt->rowCount() > 0) {
            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        } else {
            return false;
        }
    }

    public function createPhoto() {
        $query = "INSERT INTO `photos` (`id`, `userid`, `image`, `likes`)
                VALUES (id , ?, ?, 0)";
        $stmt = $this->conn->prepare($query);

        $stmt->execute(array($this->user_id, $this->image));
    }
}

?>