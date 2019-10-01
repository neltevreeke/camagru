<html>
    <head>
        <title>Login - Camagru</title>
        <link rel="stylesheet" type="text/css" href="style/style.css">
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
    </head>

    <body>
        <?php include_once ('./modules/navbar.php'); ?>

        <div id="main-wrapper" class="main-wrapper">
            <div class="forgot-password">
                <p class="forgot-password-title">Enter your new password</p>
                <input id="reset-password-input" type="password" placeholder="Enter your new password" />
                <input id="reset-password-repeat-input" type="password" placeholder="Repeat your new password" />
                <button id="reset-password-button">Reset password</button>
                <a href="login.php">Take me back</a>
            </div>
            <div id="reset-password-error" class="forgot-password-error">
            </div>
        </div>

        <?php include_once ('./modules/footer.php'); ?>
        <script src=".\js\reset_password.js"></script>
    </body>

</html>