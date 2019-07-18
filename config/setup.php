<?php
    include_once("database.php");

    $database = new Database;
    $connection = $database->connect();

    $stmt = $connection->prepare('CREATE TABLE `users` (
                                `id` int NOT NULL AUTO_INCREMENT,
                                `username` varchar(100) NOT NULL,
                                `email` varchar(100) NOT NULL,
                                `password` varchar(100) DEFAULT NULL,
                                `admin` int(2) NOT NULL,
                                PRIMARY KEY (`id`)
                            ) ENGINE=InnoDB DEFAULT CHARSET=utf8;');
    $stmt->execute();
?>