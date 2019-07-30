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
                // Return false if failed
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

    public function generateToken() {
        $query = "SELECT id FROM users 
                WHERE email = ? 
                and verified = '1'
                LIMIT 1";
        $stmt = $this->conn->prepare($query);

        $stmt->execute(array($this->email));
        $result = $stmt->fetchAll();

        // token structure: header.payload.signature
        // Creating token header as a JSON string
        $header = json_encode(['typ' => 'JWT', 'alg' => 'HS256']);
        $payload = json_encode(['user_id' => $result[0]['id']]);

        // Encoding header and payload to base 64 url strings with str replace because
        // there is no built in PHP Base64Url method yet.
        // So we have to replace + with -, / with _ and = with ''.
        $base64UrlHeader = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($header));
        $base64UrlPayload = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($payload));

        // Creating signature
        $signature = hash_hmac('sha256', $base64UrlHeader . "." . $base64UrlPayload, 'hmTarr3ls', true);
        $base64UrlSignature = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($signature));

        $token = $base64UrlHeader . "." . $base64UrlPayload . "." . $base64UrlSignature;

        return $token;
    }
}

?>