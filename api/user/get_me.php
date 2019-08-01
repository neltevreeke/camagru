<?php
include_once('../objects/tokens.php');
$token = $_SERVER["HTTP_X_TOKEN"];

// var_dump($token);

// decrypten
$userId = decryptToken($token);

// query


// ojbect of user


// echo json object back to dashboard

?>