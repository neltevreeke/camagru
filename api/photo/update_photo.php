<?php
include_once('../../config/database.php');
include_once('../objects/photo.class.php');
include_once('../objects/tokens.php');

header("Access-Control-Allow-Origin: http://localhost:8100/");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

$jsonString = file_get_contents('php://input');
$jsonDecode = json_decode($jsonString);

$database = new Database();
$db = $database->connect();

$photo = new Photo($db);

if ($jsonDecode) {
    $newAmountLikes = $photo->updatePhoto($jsonDecode);
    
    if ($newAmountLikes) {
        echo json_encode(array("message" => "Success", "likes" => $newAmountLikes));
    } else {
        echo json_encode(array("message" => "Failed"));
    }
}

?>