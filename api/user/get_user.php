<?php
include_once('../../config/database.php');
include_once('../objects/user.class.php');

$jsonString = file_get_contents('php://input');
$jsonDecode = json_decode($jsonString);
$userId = $jsonDecode;

$database = new Database();
$db = $database->connect();

$userModel = new User($db);

$user = $userModel->getUser($userId);

echo json_encode($user);


?>