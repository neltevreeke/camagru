<html>
    <head>
        <title>Create photo - Camagru</title>
        <link rel="stylesheet" type="text/css" href="style/style.css">
        <meta name='viewport' content='width=device-width, minimum-scale=1, maximum-scale=1, user-scalable=no' />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
    </head>
    <body>
        <?php include_once ('./modules/navbar.php'); ?>
        <div class="main-wrapper" id="main-wrapper">
            <div class="overlay-wrap">
                <div class="overlay-images">
                    <img src="watermarks/tiger.png" class="watermarkButton" data-watermark-type="tiger" />
                    <img src="watermarks/house.png" class="watermarkButton" data-watermark-type="house" />
                    <img src="watermarks/karate.png" class="watermarkButton" data-watermark-type="karate" />
                    <img src="watermarks/work.png" class="watermarkButton" data-watermark-type="work" />
                </div>
            </div>
            <div class="overlay-error" id="overlay-error">
            </div>
            <div id="edit-photo-container" class="edit-photo-container">
                <button id="edit-photo-update-button">Update photo</button>
            </div>
        </div>
        <?php include_once ('./modules/footer.php'); ?>
        <script src=".\js\api.js"></script>
        <script src=".\js\user.js"></script>
        <script src=".\js\edit_photo.js"></script>
    </body>
</html>