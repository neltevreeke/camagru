<?php
    include_once("database.php");

    // Get new database instance
    $database = new Database;

    // Get database connection
    $connection = $database->connect();


    // Drop table comments
    $stmt = $connection->prepare('DROP TABLE IF EXISTS `uploads`');
    $stmt->execute();

    // Drop table comments
    $stmt = $connection->prepare('DROP TABLE IF EXISTS `comments`');
    $stmt->execute();

    // Drop table photos
    $stmt = $connection->prepare('DROP TABLE IF EXISTS `photos`');
    $stmt->execute();

    // Drop table users
    $stmt = $connection->prepare('DROP TABLE IF EXISTS `users`');
    $stmt->execute();



    // Create table users
    $stmt = $connection->prepare('CREATE TABLE `users` (
                                `id` int NOT NULL AUTO_INCREMENT PRIMARY KEY,
                                `username` varchar(100) NOT NULL,
                                `email` varchar(100) NOT NULL,
                                `password` varchar(100) DEFAULT NULL,
                                `verified` int(2) NOT NULL,
                                `code` varchar(100) NOT NULL,
                                `admin` int(2) NOT NULL
                                ) ENGINE=InnoDB DEFAULT CHARSET=utf8;');
    $stmt->execute();

    // Create table photos
    $stmt = $connection->prepare('CREATE TABLE `photos` (
                                `id` int NOT NULL AUTO_INCREMENT PRIMARY KEY,
                                `userid` int(11) NOT NULL,
                                `data` MEDIUMBLOB NOT NULL,
                                `likes` int (11) NOT NULL,
                                `mimeType` varchar(100) NOT NULL,
                                FOREIGN KEY (`userid`) REFERENCES users(id)
                                ) ENGINE=InnoDB DEFAULT CHARSET=utf8;');
    $stmt->execute();

    // Create table comments
    $stmt = $connection->prepare('CREATE TABLE `comments` (
                                `id` int NOT NULL AUTO_INCREMENT PRIMARY KEY,
                                `imageid` int NOT NULL,
                                `userid` int NOT NULL,
                                `username` varchar(100) NOT NULL,
                                `comment` varchar(128) NOT NULL,
                                FOREIGN KEY (`imageid`) REFERENCES photos(id),
                                FOREIGN KEY (`userid`) REFERENCES users(id)
                                ) ENGINE=InnoDB DEFAULT CHARSET=utf8;');
    $stmt->execute();

    // Create admin user
    $password = password_hash('nelte', PASSWORD_BCRYPT);
    $stmt = $connection->prepare('INSERT INTO `users` ( `id`, `username`, `email`, `password`, `verified`, `code`, `admin`) VALUES
                                (1, 
                                "nelte",
                                "nelte.p.vreeke@gmail.com",
                                "'. $password .'",
                                1,
                                "6887ab99459f433e994ddce6fe4c134e",
                                1)');
    $stmt->execute();

?>