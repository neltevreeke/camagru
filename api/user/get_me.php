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

$userModel = new User($db);
$user = $userModel->getUser($userId);

if (!$user) {
    echo json_encode(array("message" => "Error"));
    return;
}

echo json_encode($user);

?>