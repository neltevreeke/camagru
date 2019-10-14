<html>
    <head>
        <title>Login - Camagru</title>
        <link rel="stylesheet" type="text/css" href="style/style.css">
        <meta name='viewport' content='width=device-width, minimum-scale=1, maximum-scale=1, user-scalable=no' />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
    </head>

    <body>
        <?php include_once ('./modules/navbar.php'); ?>

        <div id="main-wrapper" class="main-wrapper">
            <div class="forgot-password">
                <p class="forgot-password-title">Enter your email</p>
                <input id="forgot-password-input" type="email" placeholder="example@example.com" />
                <button id="forgot-password-button">Send email</button>
                <a href="login.php">Take me back</a>
            </div>
            <div id="forgot-password-error" class="forgot-password-error">
            </div>
        </div>

        <?php include_once ('./modules/footer.php'); ?>
        <script src=".\js\forgot_password.js"></script>
    </body>

</html>