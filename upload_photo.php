<html>
    <head>
        <title>Create photo - Camagru</title>
        <link rel="stylesheet" type="text/css" href="style/style.css">
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
    </head>
    <body>
        <?php include_once ('./modules/navbar.php'); ?>
        <div class="main-wrapper" id="main-wrapper">
            <div class="overlay-wrap">
                <div class="overlay-images">
                    <img src="img/tiger.png" id="tiger" />
                    <img src="img/house.png" id="house"/>
                    <img src="img/karate.png" id="karate"/>
                    <img src="img/work.png" id="work" />
                </div>
            </div>

            <div class="capture-wrap">
                <div class="upload-wrap">
                </div>

                <canvas id="canvas" width="500" height="480"></canvas>

                <div class="capture-button">
                    <button id="snap">Upload image</button>
                </div>
                <div class="save-button">
                    <button id="save">Save Image</button>
                </div>
            </div>
        
        </div>
        <?php include_once ('./modules/footer.php'); ?>
        <script src=".\js\api.js"></script>
        <script src=".\js\user.js"></script>
        <!-- <script src=".\js\create_photo.js"></script> -->
    </body>
</html>