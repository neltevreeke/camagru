<?php

include_once('../../config/database.php');

function getWatermarkFilePath ($watermark) {
    return '../../watermarks/' . strtolower($watermark) . '.png';
}

$id = $_GET['id'];

$database = new Database();
$db = $database->connect();

$query = "SELECT * FROM photos 
            WHERE id = ? ";
$stmt = $db->prepare($query);
$stmt->execute(array($id));

$result = $stmt->fetch();

$watermarkPath = getWatermarkFilePath($result['watermark']);
$watermark = imagecreatefrompng($watermarkPath);

$im = imagecreatefromstring($result['data']);

$marge_right = 10;
$marge_bottom = 10;
$sx = imagesx($watermark);
$sy = imagesy($watermark);

imagecopy($im, $watermark, imagesx($im) - $sx - $marge_right, imagesy($im) - $sy - $marge_bottom, 0, 0, imagesx($watermark), imagesy($watermark));

header('Content-type: image/png');
imagepng($im);
imagedestroy($im);

?>