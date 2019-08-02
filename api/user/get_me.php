<?php
include_once('../objects/tokens.php');
include_once('../../config/database.php');
include_once('../objects/user.class.php');

$token = $_SERVER["HTTP_X_TOKEN"];

// Gets new database instance and saves connection
$database = new Database();
$db = $database->connect();

// decryption
$userId = decryptToken($token);
$userId = json_decode($userId);
$userId = $userId->user_id;

// query
$query = "SELECT * FROM users 
            WHERE id = ? 
            and verified = '1'";
    $stmt = $db->prepare($query);
    $stmt->execute(array($userId));

// ojbect of user
if ($stmt->rowCount() > 0) {
    $row = $stmt->fetch(PDO::FETCH_ASSOC);
    echo json_encode($row);
} else {
    echo json_encode(array("message" => "Error"));
}

?>