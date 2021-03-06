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

    public function getComments($photoId) {
        $query = "SELECT c.id, c.comment, u.username
                FROM comments c
                JOIN users u ON c.user_id = u.id
                WHERE c.photo_id = ?";
        $stmt = $this->conn->prepare($query);

        $stmt->execute(array((int)$photoId));

        if ($stmt->rowCount() > 0) {
            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        } else {
            return [];
        }
    }

    public function getAllPhotos() {
        $query = "SELECT photos.id, photos.userid, l.likes, u.username
                FROM photos
                LEFT OUTER JOIN (
                    SELECT photo_id, COUNT(*) as likes
                    FROM rating_info
                    GROUP BY photo_id
                ) l ON l.photo_id = photos.id
                JOIN users u ON photos.userid = u.id";

        $stmt = $this->conn->prepare($query);

        $stmt->execute();

        if ($stmt->rowCount() < 0) {
            return false;
        }

        $photos = $stmt->fetchAll(PDO::FETCH_ASSOC);

        foreach ($photos as &$photo) {
            $comments = $this->getComments($photo['id']);
            $photo['comments'] = $comments;
        }

        return $photos;
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

    public function mailPhotoUpdate($user) {
        $htmlStr = "";
        $htmlStr .= "Hi " . $user[0]['username'] . ", <br /><br />";
        $htmlStr .= "You have a new comment on your photo! <br />";
        $htmlStr .= "Check it out at <a href='http://localhost:8100/index.php'>our website.</a> <br />";
        $htmlStr .= "Kind regards,<br />";
        $htmlStr .= "Camagru";

        $name = "Camagru";
        $subject = "Camagru | A user commented on your photo";
        $recipient_email = $user[0]['email'];
        $email_sender = "no-reply@camagru.com";

        $headers  = "MIME-Version: 1.0\r\n";
        $headers .= "Content-type: text/html; charset=iso-8859-1\r\n";
        $headers .= "From: {$name} <{$email_sender}> \n";

        $body = $htmlStr;

        mail($recipient_email, $subject, $body, $headers);
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

                $id = $this->conn->lastInsertId();

                $query = "SELECT u.id, u.email, u.username, u.notifications
                        FROM users u
                        JOIN photos p ON u.id = p.userid
                        JOIN comments c ON p.id = c.photo_id
                        WHERE c.photo_id = ? LIMIT 1";
                $stmt = $this->conn->prepare($query);

                $stmt->execute(array($updatedFields->photoid));

                $result = $stmt->fetchAll(PDO::FETCH_ASSOC);

                if ($result[0]['notifications']) {
                    $this->mailPhotoUpdate($result);
                }

                return $id;
            case 'uncomment':
                $query = "DELETE FROM comments 
                        WHERE id=?";
                $stmt = $this->conn->prepare($query);

                if ($stmt->execute(array($updatedFields->id))) {
                    return true;
                } else {
                    return false;
                }

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