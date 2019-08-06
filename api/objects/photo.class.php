<?php

class Photo {
    public $user_id;

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
            $numRows = $stmt->rowCount();
            $rows = $stmt->fetchAll();
            $photoArr = array();
            $i = 0;

            foreach ($rows as $userPhoto) {
                $photoArr[$i] = $userPhoto;
                $i++;
            }

            return $photoArr;
        } else {
            return false;
        }
    }
}

?>