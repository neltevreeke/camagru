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

echo $result['data'];



?>