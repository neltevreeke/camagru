<?php

class Photo {
    public $user_id;
    public $image;

    private $conn;
    private $tableName = 'photos';
    private $likeTable = 'rating_info';
    private $commentTable = 'comments';

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
        // $query = "SELECT photos.id, photos.userid, l.likes
        //         FROM photos
        //         LEFT OUTER JOIN (
        //             SELECT photo_id, COUNT(*) as likes
        //             FROM rating_info
        //             GROUP BY photo_id
        //         ) l ON l.photo_id = photos.id";

        $query = "SELECT photos.id, photos.userid, c.comment_info, l.likes
                FROM photos 
                LEFT OUTER JOIN ( 
                    SELECT `photo_id`, GROUP_CONCAT(`user_id`, ':', `comment` SEPARATOR '|') as comment_info
                    FROM comments
                    GROUP BY photo_id
                ) c ON c.photo_id = photos.id
                LEFT OUTER JOIN (
                    SELECT photo_id, COUNT(*) as likes
                    FROM rating_info
                    GROUP BY photo_id
                ) l ON l.photo_id = photos.id";

        $stmt = $this->conn->prepare($query);

        $stmt->execute();

        if ($stmt->rowCount() > 0) {
            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        } else {
            return false;
        }
    }

    public function uploadPhoto($mimeType, $watermark) {
        $query = "INSERT INTO `photos` (`id`, `userid`, `data`, `mimeType`, `watermark`)
                 VALUES (id, ?, ?, ?, ?)";
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

    public function checkUserLike($updatedFields) {
        $query = "SELECT * FROM " . $this->likeTable . " WHERE user_id=? AND photo_id=? AND rating_action='like'";
        $stmt = $this->conn->prepare($query);

        $stmt->execute(array($updatedFields->userid, $updatedFields->photoid));

        if ($stmt->rowCount() > 0) {
            return true;
        } else {
            return false;
        }
    }

    public function updatePhoto($updatedFields) {
        switch ($updatedFields->action) {
            case 'like':
                $query = "INSERT INTO " . $this->likeTable . " (user_id, photo_id, rating_action)
                        VALUES (?, ?, ?)
                        ON DUPLICATE KEY UPDATE rating_action=" . "'like'";
                $stmt = $this->conn->prepare($query);

                $stmt->execute(array($updatedFields->userid, $updatedFields->photoid, $updatedFields->action));

                break;
            case 'unlike':
                $query = "DELETE FROM " . $this->likeTable . " 
                        WHERE user_id=? AND photo_id=?";
                $stmt = $this->conn->prepare($query);

                $stmt->execute(array($updatedFields->userid, $updatedFields->photoid));

                break;
            case 'comment':
                $comment = htmlspecialchars(strip_tags($updatedFields->comment));

                $query = "INSERT INTO comments (photo_id, user_id, comment) 
                        VALUES (?, ?, ?)";
                $stmt = $this->conn->prepare($query);
                
                $stmt->execute(array($updatedFields->photoid, $updatedFields->userid, $comment));

                return true;
            case 'uncomment':
                $query = "DELETE FROM comments 
                        WHERE user_id=? 
                        AND photo_id=? 
                        AND comment=?";
                $stmt = $this->conn->prepare($query);

                $stmt->execute(array($updatedFields->userid, $updatedFields->photoid, $updatedFields->comment));

                return true;
            default:
                break;
        }

        // not sure about this.
        return $this->getLikes($updatedFields);
    }

    public function getLikes($updatedFields) {
        $query = "SELECT * FROM " . $this->likeTable . " 
                WHERE photo_id=? AND rating_action='like'";
        $stmt = $this->conn->prepare($query);

        $stmt->execute(array($updatedFields->photoid));
        $result = $stmt->fetchAll(PDO::FETCH_ASSOC);

        return count($result);
    }
}

?>