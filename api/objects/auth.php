<?php
include_once('tokens.php');
include_once('../../config/database.php');
include_once('../objects/user.class.php');

function notAllowed () {
    http_response_code(403);
    exit();
}

if (!isset($_SERVER) || !isset($_SERVER['HTTP_X_TOKEN'])) {
    notAllowed();
}

$token = $_SERVER["HTTP_X_TOKEN"];

// Gets new database instance and saves connection
$database = new Database();
$db = $database->connect();

// decryption
$userId = decryptToken($token);
$userId = json_decode($userId);
$userId = $userId->user_id;

// Get user
$query = "SELECT * FROM users 
            WHERE id = ? 
            and verified = '1'";
    $stmt = $db->prepare($query);
    $stmt->execute(array($userId));

if ($stmt->rowCount() > 0) {
    $user = $stmt->fetch(PDO::FETCH_ASSOC);
    $GLOBALS['user'] = $user;
} else {
    notAllowed();
}

?>