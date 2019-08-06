<?php
include_once("../../config/database.php");
include_once('../objects/photo.class.php');

$id = $_SERVER['HTTP_ID'];

// Get new database instance and connection
$database = new Database;
$db = $database->connect();

// Gets new photo instance
$photo = new Photo($db);

$photo->user_id = $id;

$photoArr = $photo->getPhoto();

if ($photoArr) {
    echo json_encode(array("message" => "success", "photos" => $photoArr));
} else {
    echo json_encode(array("message" => "No photos found"));
}
?>