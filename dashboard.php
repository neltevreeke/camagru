<html>
    <head>
        <title>Dashboard - Camagru</title>
        <link rel="stylesheet" type="text/css" href="style/style.css">
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
    </head>
    <body>
        <?php include_once ('./modules/navbar.php'); ?>
        <div class="main-wrapper" id="main-wrapper">
            <div class="user-sidebar" id="user-sidebar">
                <div class="user-title">
                    <p id="user-title"></p>
                </div>
                <div class="user-details">
                    <div class="user-details-username">
                        <p class="user-details-title">Username:</p>
                        <p id="user-details-username"></p>
                    </div>
                    <div class="user-details-email">
                        <p class="user-details-title">Email:</p>
                        <p id="user-details-email"></p>
                    </div>
                </div>
                <div class="user-title">
                    <p>Change details</p>
                </div>
                <div class="user-details-username">
                    <p class="user-details-title">Change Username:</p>
                    <p><input id="new-username-value" type="text" placeholder="Enter new username" /><button id="change-username"><span class="fa fa-edit"></span></button></p>
                    <p class="user-details-title">Change Email:</p>
                    <p><input id="new-email-value" type="email" placeholder="Enter new email" /><button id="change-email"><span class="fa fa-edit"></span></button></p>
                    <p class="user-details-title">Change Password:</p>
                    <p><input id="new-password-value" type="password" placeholder="Enter new password" /></p>
                    <p><input id="new-password-repeat-value" type="password" placeholder="Repeat new password" /><button id="change-password"><span class="fa fa-edit"></span></button></p>
                    <div class="change-details-error" id="change-details-error">
                    </div>
                </div>
            </div>
        <?php include_once ('./modules/footer.php'); ?>
        <script src=".\js\api.js"></script>
        <script src=".\js\user.js"></script>
        <script src=".\js\dashboard.js"></script>
    </body>
</html>