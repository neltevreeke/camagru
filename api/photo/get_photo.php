<?php
include_once("../objects/auth.php");

include_once("../../config/database.php");
include_once('../objects/photo.class.php');

$userId = $GLOBALS["user"]["id"];

// Get new database instance and connection
$database = new Database;
$db = $database->connect();

// Gets new photo instance
$photo = new Photo($db);

$photo->user_id = $userId;
$photoArr = $photo->getPhoto();

header('Content-Type: application/json');

if ($photoArr) {
    echo json_encode(array("message" => "success", "photos" => $photoArr));
} else {
    echo json_encode(array("message" => "No photos found"));
}
?>