<?php
include_once('../../config/database.php');
include_once('../objects/user.class.php');

// Sets active headers on page
header("Access-Control-Allow-Origin: http://localhost/");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

// Gets new database instance and saves connection
$database = new Database();
$db = $database->connect();

// Gets new user instance
$user = new User($db);

// decodes javascript sent ajax request
$jsonString = file_get_contents('php://input');
$jsonDecode = json_decode($jsonString);

// sets user variables to input variables
$user->username = $jsonDecode->username;
$user->email = $jsonDecode->emailaddress;
$user->password = $jsonDecode->password;

// Check for unique email and username
$emailExist = $user->checkEmail();
$usernameExist = $user->checkUsername();

if ($usernameExist) {
    echo json_encode(array("message" => "Username already in use"));
    die();
}
if ($emailExist) {
    echo json_encode(array("message" => "Email already in use"));
    die();
}
if (!$emailExist && !$usernameExist) {
    $user->create();
    $user->verifyEmail();
    echo json_encode(array("message" => "User successfully created"));
}

?>