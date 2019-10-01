<?php
include_once('../../config/database.php');
include_once('../objects/user.class.php');
include_once('../objects/tokens.php');

header("Access-Control-Allow-Origin: http://localhost:8100/");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

$jsonString = file_get_contents('php://input');
$jsonDecode = json_decode($jsonString);

if (isset($_SERVER["HTTP_X_TOKEN"])) {
    $token = $_SERVER["HTTP_X_TOKEN"];

    $userId = decryptToken($token);
    $userId = json_decode($userId);
    $userId = $userId->user_id;
} else {
    $tmpObj = $jsonDecode;

    $jsonDecode = base64_decode($jsonDecode->get);
    $tmp = explode('.', $jsonDecode);
    $userId = $tmp[0];

    $jsonDecode = $tmpObj;
}


// Gets new database instance and saves connection
$database = new Database();
$db = $database->connect();

$user = new User($db);

if ($jsonDecode) {
    if (isset($jsonDecode->username)) {
        $user->username = $jsonDecode->username;

        if ($user->checkUsername()) {
            echo json_encode(array("message" => "Username already exists"));

            return;
        }
    }

    if (isset($jsonDecode->email)) {
        $user->email = $jsonDecode->email;

        if ($user->checkEmail()) {
            echo json_encode(array("message" => "Email already exists"));

            return;
        }
    }

    $user->notifyUserChanges($userId, $jsonDecode);
    $user->updateUser($userId, $jsonDecode);
    $newUser = $user->getUser($userId);
    
    echo json_encode(array("message" => "Success", "user" => $newUser));
} else {
    echo json_encode(array("message" => "Something went wrong"));
}

?>