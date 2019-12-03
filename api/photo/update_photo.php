<?php
include_once('../../config/database.php');
include_once('../objects/photo.class.php');
include_once('../objects/tokens.php');
include_once("../objects/auth.php");

header("Access-Control-Allow-Origin: http://localhost:8100/");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

$jsonString = file_get_contents('php://input');
$jsonDecode = json_decode($jsonString);

$database = new Database();
$db = $database->connect();

$photo = new Photo($db);

if (!isset($jsonDecode->action)) {
    $userLike = $photo->checkUserLike($jsonDecode);

    if (!$userLike) {
        echo json_encode(array("message" => "Photo not liked"));
        return;
    }

    echo json_encode(array("message" => "photo liked"));
    return;
}

if ($jsonDecode->action == "comment") {
    $lastId = $photo->updatePhoto($jsonDecode);
    
    if ($lastId) {
        echo json_encode(array("message" => "Success", "newCommentId" => $lastId));
    } else {
        echo json_encode(array("message" => "Failure"));
    }
}

if ($jsonDecode->action == "uncomment") {

    if ($photo->updatePhoto($jsonDecode)) {
        echo json_encode(array("message" => "Success"));
    } else {
        echo json_encode(array("message" => "Failure"));
    }
}

if ($jsonDecode->action == "like" || $jsonDecode->action == "unlike") {
    $totalLikes = $photo->updatePhoto($jsonDecode);

    if ($totalLikes || $totalLikes === 0) {
        echo json_encode(array("message" => "Success", "likes" => $totalLikes));
    } else {
        echo json_encode(array("message" => "Failed"));
    }

}

?>