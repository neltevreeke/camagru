<?php

include_once('../../config/database.php');

$id = $_GET['id'];

$database = new Database();
$db = $database->connect();

$query = "SELECT * FROM photos 
            WHERE id = ? ";
$stmt = $db->prepare($query);
$stmt->execute(array($id));
$result = $stmt->fetch();

// header('Content-Type: image/png');

// header('content-type: image/png');
echo $a=$result['data'];

// echo base64_decode($a); 

// echo base64_encode($result["data"]);

// echo("data: " . $result['mimeType'] . "")

// echo "data: $mime" $result['$data']";


/**
 * TODO:
 * 
 * - in the url there wil be $_GET['id']
 * - use that id to SELECT * FROM photos WHERE id = $_GET['ID']
 * - echo blobcontent + https://stackoverflow.com/questions/20556773/php-display-image-blob-from-mysql
 */






?>