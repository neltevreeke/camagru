<?php
    $url = parse_url($_SERVER['REQUEST_URI']);
    $path = $url["path"];
    $result = str_replace("/", "", $path);

    if (!$result) {
        echo ('<div class = "navbar">
                    <div class = "menu">
                        <a href="index.php" class="active">home</a>
                        <a href="login.php">login</a>
                        <a href="#">about</a>
                    </div>
                </div>');
    } else if ($result === "index.php") {
        echo ('<div class = "navbar">
                <div class = "menu">
                    <a href="index.php" class="active">home</a>
                    <a href="login.php">login</a>
                    <a href="#">about</a>
                </div>
            </div>');
    } else if ($result === "login.php") {
        echo ('<div class = "navbar">
                <div class = "menu">
                    <a href="index.php">home</a>
                    <a href="login.php" class="active">login</a>
                    <a href="#">about</a>
                </div>
            </div>');
    }
?>