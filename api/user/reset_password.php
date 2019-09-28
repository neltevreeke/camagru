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

// Gets new user instance
$user = new User($db);

// decodes javascript sent ajax request
$jsonString = file_get_contents('php://input');
$jsonDecode = json_decode($jsonString);

var_dump($jsonDecode);

?>