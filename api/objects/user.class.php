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

    public function getUser ($userId) {
        $stmt = $this->conn->prepare("SELECT * FROM users WHERE id = ? AND verified = '1'");
        $stmt->execute(array($userId));

        if ($stmt->rowCount() > 0) {
            $row = $stmt->fetch(PDO::FETCH_ASSOC);
            unset($row['password']);
            
            return $row;
        } else {
            return false;
        }
    }

    public function updateUser($userId, $updateFields) {
        $updateQuery = "";

        foreach ($updateFields as $field) {
            $field = htmlspecialchars(strip_tags($field));
        }

        if (isset($updateFields->username)) {
            $updateQuery .= " SET `username` = '" . $updateFields->username . "'";
        }

        if (isset($updateFields->email)) {
            $updateQuery .= " SET `email` = '" . $updateFields->email . "'";
        }

        if (isset($updateFields->password)) {
            $newPassword = password_hash($updateFields->password, PASSWORD_BCRYPT);

            $updateQuery .= " SET `password` = '" . $newPassword . "'";
        }

        if (isset($updateFields->notifications)) {
            $updateQuery .= " SET `notifications` = '" . $updateFields->notifications . "'";
        }

        if ($updateQuery != "") {
            $query = "UPDATE " . $this->tableName .
                    $updateQuery . " WHERE id = ? LIMIT 1";
            
            $stmt = $this->conn->prepare($query);
            $stmt->execute(array($userId));
            
            return true;
        } else {
            return false;
        }
    }

    public function notifyUserChanges($userId, $updateFields) {
        $query = "SELECT `email`, `username` FROM `users` 
                WHERE id=? LIMIT 1";
        $stmt = $this->conn->prepare($query);

        $stmt->execute(array($userId));

        if ($stmt->rowCount() <= 0) {
            return false;
        } else {
            $recipient = $stmt->fetch();
        }

        $recipientOldEmail = $recipient['email'];
        $recipientOldUsername = $recipient['username'];

        $name = "Camagru";
        $email_sender = "no-reply@camagru.com";
        $subject = "Camagru | Changes to your account";
        $body = "";
        $body .= "Hi " . $recipientOldUsername . ", <br/><br/>";
        $body .= "We are sending you this email to notify the changes to your account. <br/>";

        $headers  = "MIME-Version: 1.0\r\n";
        $headers .= "Content-type: text/html; charset=iso-8859-1\r\n";
        $headers .= "From: {$name} <{$email_sender}> \n";

        if (isset($updateFields->username)) {
            $body .= "We have changed your username from " . $recipientOldUsername . " to " . $updateFields->username . ". <br/><br/>";
        }

        if (isset($updateFields->email)) {
            $body .= "We have changed your email from " . $recipientOldEmail . " to " . $updateFields->email . ". <br/><br/>";
        }

        if (isset($updateFields->password)) {
            $body .= "We have changed your password to your new password, you are now able to login with your new password. <br/><br/>";
        }

        $body .= "Kind regards,<br />";
        $body .= "Camagru";

        mail($recipientOldEmail, $subject, $body, $headers);
    }

    public function resetPassword($email) {
        $query = "SELECT * FROM `users` 
                WHERE email=? LIMIT 1";
        $stmt = $this->conn->prepare($query);
        
        $stmt->execute(array($email));
        $result = $stmt->fetch(PDO::FETCH_ASSOC);

        $userId = $result['id'];
        $verificationCode = $result['code'];
        $username = $result['username'];

        $verificationCode = $userId . "." . $verificationCode;
        
        if ($stmt->rowCount() > 0) {
            $verificationCode = base64_encode($verificationCode);

            $verificationLink = "http://localhost:8100/reset_password.php?code=" . $verificationCode;

            $name = "Camagru";
            $email_sender = "no-reply@camagru.com";
            $recipientEmail = $email;
            $subject = "Password reset";

            $body = "";
            $body .= "Dear " . $username . ", <br/><br/>";
            $body .= "We are sending you this email with a link to reset your password. <br/>";
            $body .= $verificationLink . " <br/><br/>";
            $body .= "In case you did not request a password reset, we advice you to do nothing with this email. <br/><br/>";
            $body .= "Kind regards,<br />";
            $body .= "Camagru";

            $headers  = "MIME-Version: 1.0\r\n";
            $headers .= "Content-type: text/html; charset=iso-8859-1\r\n";
            $headers .= "From: {$name} <{$email_sender}> \n";

            mail($recipientEmail, $subject, $body, $headers);

            return true;
        } else {

            return false;
        }

    }
}

?>