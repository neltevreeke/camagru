<?php
    include_once("database.php");

    // Get new database instance
    $database = new Database;

    // Get database connection
    $connection = $database->connect();

    // Drop table users
    $stmt = $connection->prepare('DROP TABLE IF EXISTS `users`');
    $stmt->execute();

    // Drop table photos
    $stmt = $connection->prepare('DROP TABLE IF EXISTS `photos`');
    $stmt->execute();

    // Drop table comments
    $stmt = $connection->prepare('DROP TABLE IF EXISTS `comments`');
    $stmt->execute();



    // Create table users
    $stmt = $connection->prepare('CREATE TABLE `users` (
                                `id` int NOT NULL AUTO_INCREMENT,
                                `username` varchar(100) NOT NULL,
                                `email` varchar(100) NOT NULL,
                                `password` varchar(100) DEFAULT NULL,
                                `admin` int(2) NOT NULL,
                                PRIMARY KEY (`id`)
                                ) ENGINE=InnoDB DEFAULT CHARSET=utf8;');
    $stmt->execute();

    // Create table photos
    $stmt = $connection->prepare('CREATE TABLE `photos` (
                                `id` int NOT NULL AUTO_INCREMENT PRIMARY KEY,
                                `userid` int(11) NOT NULL,
                                `image` varchar(128) NOT NULL,
                                `likes` int (11) NOT NULL,
                                FOREIGN KEY (`userid`) REFERENCES users(id)
                                ) ENGINE=InnoDB DEFAULT CHARSET=utf8;');
    $stmt->execute();

    // Create table comments
    $stmt = $connection->prepare('CREATE TABLE `comments` (
                                `id` int NOT NULL AUTO_INCREMENT,
                                `username` varchar(100) NOT NULL,
                                `comment` varchar(128) NOT NULL,
                                FOREIGN KEY (`username`) REFERENCES users(username)
                                ) ENGINE=InnoDB DEFAULT CHARSET=utf8;');
    $stmt->execute();

?>