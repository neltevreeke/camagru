<?php
include_once("../objects/auth.php");

include_once("../../config/database.php");
include_once('../objects/photo.class.php');

$userId = $GLOBALS["user"]["id"];

$database = new Database;
$db = $database->connect();

$photo = new Photo($db);
$photo->user_id = $userId;

$watermark = $_POST['watermark'];
$photoId = $_POST['photoId'];

if ($photo->editPhoto($watermark, $photoId)) {
    echo json_encode(array("message" => "Success"));
} else {
    echo json_encode(array("message" => "Failed"));
}

?>