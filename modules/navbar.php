<?php
    $url = parse_url($_SERVER['REQUEST_URI']);
    $path = $url["path"];
    $result = str_replace("/", "", $path);

    if (!$result) {
        echo ('<div class = "navbar">
                    <div class = "menu">
                        <a href="index.php" class="active">home</a>
                        <a href="login.php">login / register</a>
                    </div>
                </div>');
    } else if ($result === "index.php") {
        echo ('<div class = "navbar">
                    <div class = "menu">
                        <a href="index.php" class="active">home</a>
                        <a href="login.php">login / register</a>
                    </div>
                </div>');
    } else if ($result === "login.php") {
        echo ('<div class = "navbar">
                    <div class = "menu">
                        <a href="index.php">home</a>
                        <a href="login.php" class="active">login / register</a>
                    </div>
                </div>');
    } else if ($result === "dashboard.php") {
        echo ('<div class = "navbar">
                    <div class = "menu">
                        <a href="index.php">home</a>
                        <a href="dashboard.php" class="active">Dashboard</a>
                        <a href="logout.php">log out</a>
                    </div>
                </div>');
    } else if ($result === "create_photo.php") {
        echo ('<div class = "navbar">
                    <div class = "menu">
                        <a href="index.php">home</a>
                        <a href="dashboard.php" class="active">Dashboard</a>
                        <a href="logout.php">log out</a>
                    </div>
                </div>');
    }
?>

<html>
    <body>
        <script src=".\js\navbar.js"></script>
    </body>
</html>