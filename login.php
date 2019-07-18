<html>
    <head>
        <title>Camagru</title>
        <link rel="stylesheet" type="text/css" href="style/style.css">
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
    </head>

    <body>
        <?php include_once ('./modules/navbar.php'); ?>

        <div class = "main-wrapper">
            <div class = "login-form">
                <div class = "form-title">
                    <h3>Already an existing user?</h3>
                </div>
                <form>
                    <input id = "email" type = "email" placeholder = "Emailaddress" />
                    <input id = "password" type = "password" placeholder = "Password" />
                    <input id = "login" type = "submit" value = "Log in" />
                </form>
            </div>
            <div class = "register-form">
                <div class = "form-title">
                    <h3>Create a new account</h3>
                </div>
                <form>
                    <input id = "username" type = "text" placeholder = "Username" />
                    <input id = "email" type = "email" placeholder = "Emailaddress" />
                    <input id = "password" type = "password" placeholder = "Password" />
                    <input id = "password" type = "password" placeholder = "Repeat password" />
                    <input id = "register" type = "submit" value = "Register" />
                </form>
            </div>
        </div>
    </body>

</html>