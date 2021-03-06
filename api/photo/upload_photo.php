<?php
include_once("../objects/auth.php");

include_once("../../config/database.php");
include_once('../objects/photo.class.php');

$userId = $GLOBALS["user"]["id"];

$database = new Database;
$db = $database->connect();

$photo = new Photo($db);

ob_start();
readfile($_FILES['image']['tmp_name']);
$file = ob_get_contents();
ob_end_clean();

$photo->image = $file;
$photo->user_id = $userId;
$mimeType = $_FILES['image']['type'];
$watermark = $_POST['watermark'];

if ($photo->image) {
    if ($mimeType === 'image/png' || $mimeType === 'image/jpg' || $mimeType === 'image/jpeg') {
        $lastId = $photo->uploadPhoto($mimeType, $watermark);
        echo json_encode(array("message" => "Success"));
    } else {
        echo json_encode(array("message" => "Wrong file type"));
    }
} else {
    echo json_encode(array("message" => "Failed"));
}


?>
