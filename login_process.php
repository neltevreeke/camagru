<?php

print_r($_POST);


$data = json_decode(file_get_contents('php://input'));

echo ($data);

?>