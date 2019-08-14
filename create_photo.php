<html>
    <head>
        <title>Create photo - Camagru</title>
        <link rel="stylesheet" type="text/css" href="style/style.css">
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
    </head>
    <body>
        <?php include_once ('./modules/navbar.php'); ?>
        <div class="main-wrapper" id="main-wrapper">
            <!-- Stream video via webcam -->
            <div class="video-wrap">
                <video id="video" playsinline autoplay></video>
            </div>

            <!-- Trigger canvas web API -->
            <div class="controller">
                <button id="snap">Capture</button>
            </div>

            <!-- Webcam video snapshot -->
            <canvas id="canvas" width="640" height="480"></canvas>
        </div>
        <?php include_once ('./modules/footer.php'); ?>
        <script src=".\js\api.js"></script>
        <script src=".\js\user.js"></script>
        <script src=".\js\create_photo.js"></script>
    </body>
</html>