<?php
include_once("../../config/database.php");

$db = new Database;
$dbConnection = $db->connect();
$tableName = 'users';
$verificationCode = $_GET['code'];

$query = "SELECT id FROM " . $tableName ." 
        WHERE code = ? 
        and verified = '0'";
$stmt = $dbConnection->prepare($query);
$stmt->execute(array($verificationCode));

if ($stmt->rowCount() > 0) {
    $query = "UPDATE ". $tableName . "
            set verified = '1'
            WHERE code = ?";
    $stmt = $dbConnection->prepare($query);

    $checkValid = $stmt->execute(array($verificationCode));
    if ($checkValid) {
        header('Location: http://localhost:8100/login.php');
    } else {
        return false;
    }
} else {
    return false;
}
?>