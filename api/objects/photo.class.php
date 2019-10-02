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
        $query = "SELECT id FROM " . $this->tableName . "
                WHERE userid = ?";
        $stmt = $this->conn->prepare($query);

        $stmt->execute(array($this->user_id));
        
        if ($stmt->rowCount() > 0) {
            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        } else {
            return false;
        }
    }

    public function getAllPhotos() {
        $query = "SELECT id, userid, likes FROM " . $this->tableName. "";
        $stmt = $this->conn->prepare($query);

        $stmt->execute();

        if ($stmt->rowCount() > 0) {
            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        } else {
            return false;
        }
    }

    public function uploadPhoto($mimeType, $watermark) {
        $query = "INSERT INTO `photos` (`id`, `userid`, `data`, `likes`, `mimeType`, `watermark`)
                 VALUES (id, ?, ?, 0, ?, ?)";
        $stmt = $this->conn->prepare($query);

        $stmt->execute(array($this->user_id, $this->image, $mimeType, $watermark));

        if ($stmt->rowCount() > 0) {
            $id = $this->conn->lastInsertId();
            return $id;
        } else {
            return false;
        }
    }

    public function editPhoto($watermark, $photoId) {
        $query = "UPDATE " . $this->tableName . " SET watermark=? WHERE id=? AND userid=?";
        $stmt = $this->conn->prepare($query);
        
        if ($stmt->execute(array($watermark, $photoId, $this->user_id))) {
            return true;
        } else {
            return false;
        }
    }

    public function updatePhoto($updatedFields) {
        if (isset($updatedFields->like)) {
            $query = "UPDATE " . $this->tableName . " SET likes = likes + 1 WHERE id=?";
        }

        if (isset($updatedFields->comment)) {
            $query = "";
        }

        $stmt = $this->conn->prepare($query);
        
        if ($stmt->execute(array($updatedFields->like))) {
            return true;
        } else {
            return false;
        }
    }
}

?>