<?php

class User {
    public $id;
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
                (username, email, password, verified, admin)
                VALUES ( ?, ?, ?, 0, 0)";
        $stmt = $this->conn->prepare($query);

        $stmt->execute(array($this->username, $this->email, $this->password));
    }

    public function checkEmail() {
        $this->email = htmlspecialchars(strip_tags($this->email));

        $query = "SELECT * FROM " . $this->tableName . 
                " WHERE email= '". $this->email ."' 
                LIMIT 1";
        $stmt = $this->conn->prepare($query);

        $stmt->execute();

        if ($stmt->rowCount() > 0) {
            return true;
        }
        return false;
    }

    public function checkUsername() {
        $this->username = htmlspecialchars(strip_tags($this->username));

        $query = "SELECT * from " . $this->tableName .
                " WHERE username= '". $this->username ."'
                LIMIT 1";
        $stmt = $this->conn->prepare($query);

        $stmt->execute();

        if ($stmt->rowCount() > 0) {
            return true;
        }
        return false;
    }

    public function verifyEmail() {
        // Check if user has verified email
        $this->email = htmlspecialchars(strip_tags($this->email));

        $query = "SELECT id FROM users 
                WHERE email = ? 
                and verified = '1'";
        $stmt = $this->conn->prepare($query);

        $stmt->execute(array($this->email));

        if ($stmt->rowCount() > 0) {
            // true if email has been already verified
            return true;
        } else {
            // Send email if not verified
            $verificationCode = md5(uniqid("mysuperrandomanduniquestringfortheverification", true));
            $verificationLink = "http://localhost:8100/api/user/activate_user.php?code=" . $verificationCode;

            $htmlStr = "";
            $htmlStr .= "Hi " . $this->username . ", <br /><br />";
            $htmlStr .= "Please click the link below to verify your account for Camagru.<br />";
            $htmlStr .= $verificationLink ."<br /><br />";
            $htmlStr .= "Kind regards,<br />";
            $htmlStr .= "Camagru";

            $name = "Camagru";
            $subject = "Camagru | verification link";
            $recipient_email = $this->email;
            $email_sender = "no-reply@camagru.com";

            $headers  = "MIME-Version: 1.0\r\n";
            $headers .= "Content-type: text/html; charset=iso-8859-1\r\n";
            $headers .= "From: {$name} <{$email_sender}> \n";

            $body = $htmlStr;

            if (mail($recipient_email, $subject, $body, $headers)) {
                // Return true if link has been clicked and user updated
                $query = "UPDATE " . $this->tableName . "
                        SET
                        code = ?
                        WHERE email = ?";
                $stmt = $this->conn->prepare($query);
                
                $stmt->execute(array($verificationCode, $this->email));
                return true;
            } else {
                return false;
            }
        }
    }

    public function loginWithEmail() {
        $this->email = htmlspecialchars(strip_tags($this->email));

        $query = "SELECT * FROM " . $this->tableName . 
                " WHERE email= '". $this->email ."' 
                LIMIT 1";
        $stmt = $this->conn->prepare($query);

        $stmt->execute();

        if ($stmt->rowCount() > 0) {
            $row = $stmt->fetch(PDO::FETCH_ASSOC);

            $this->id = $row['id'];
            $this->username = $row['username'];
            $this->password = $row['password'];
            return true;
        }
        return false;
    }

    public function getUserId() {
        $query = "SELECT id FROM users 
                WHERE email = ? 
                and verified = '1'
                LIMIT 1";
        $stmt = $this->conn->prepare($query);

        $stmt->execute(array($this->email));
        $result = $stmt->fetchAll();

        return $result[0]['id'];
    }

}

?>