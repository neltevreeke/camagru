<html>
    <head>
        <title>Login - Camagru</title>
        <link rel="stylesheet" type="text/css" href="style/style.css">
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
    </head>

    <body>
        <?php include_once ('./modules/navbar.php'); ?>

        <div id = "main-wrapper" class = "main-wrapper">
            <div class = "login-form">
                <div class = "form-title">
                    <h3>Already an existing user?</h3>
                </div>
                <form>
                    <input id = "login-mail" type = "email" placeholder = "Emailaddress" />
                    <input id = "login-password" type = "password" placeholder = "Password" />
                    <button id = "login" type = "button">Log in</button>
                </form>
            </div>
            <div class = "register-form">
                <div class = "form-title">
                    <h3>Create a new account</h3>
                </div>
                <form>
                    <input id = "register-username" type = "text" placeholder = "Username" />
                    <input id = "register-mail" type = "email" placeholder = "Emailaddress" />
                    <input id = "register-password" type = "password" placeholder = "Password" />
                    <input id = "register-reppassword" type = "password" placeholder = "Repeat password" />
                    <button id = "register" type = "button">Register</button>
                </form>
            </div>
            <div class = "register-error" id = "register-error">
            </div>
            <div class = "login-error" id = "login-error">
            </div>
        </div>
        <?php include_once ('./modules/footer.php'); ?>
        <script src=".\js\register.js"></script>
        <script src=".\js\login.js"></script>
    </body>

</html>