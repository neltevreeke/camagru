<?php
include_once('../../config/database.php');
include_once('../objects/user.class.php');

header("Access-Control-Allow-Origin: http://localhost/");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

$database = new Database();
$db = $database->connect();

$user = new User($db);

$jsonString = file_get_contents('php://input');
$jsonDecode = json_decode($jsonString);

$user->email = $jsonDecode;

if ($user->checkEmail()) {
    if ($user->resetPassword($user->email)) {
        echo json_encode(array("message" => "An email has been sent"));
    } else {
        echo json_encode(array("message" => "Email has not been found"));
    }
} else {
    echo json_encode(array("message" => "Email has not been found"));
}

?>