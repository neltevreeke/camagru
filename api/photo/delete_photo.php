<?php

include_once('../../config/database.php');

$json = file_get_contents('php://input');
$jsonDecode = json_decode($json);

$photoId = $jsonDecode;

$database = new Database;
$db = $database->connect();

$query = "DELETE FROM photos 
            WHERE id = ? ";
$stmt = $db->prepare($query);

if ($stmt->execute(array($photoId))){
    echo json_encode(array("message" => "Success"));
} else {
    echo json_encode(array("message" => "Failed"));
}

?>