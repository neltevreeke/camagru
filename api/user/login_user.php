<?php
include_once('../../config/database.php');
include_once('../objects/user.class.php');
include_once('../objects/tokens.php');

header("Access-Control-Allow-Origin: http://localhost:8100/");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

// Gets new database instance and saves connection
$database = new Database();
$db = $database->connect();

// Gets new user instance
$user = new User($db);

$jsonString = file_get_contents('php://input');
$jsonDecode = json_decode($jsonString);

$user->email = $jsonDecode->email;
$email_exists = $user->loginWithEmail();

if ($email_exists && password_verify($jsonDecode->password, $user->password)) {

    $userid = $user->getUserId();
    $token = generateToken($userid);
    
    echo json_encode(array("message" => "success", "token" => $token));
} else {
    echo json_encode(array("message" => "failed"));
}


?>