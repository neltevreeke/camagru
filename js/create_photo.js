(function () {
    const video = document.getElementById('video');
    const canvas = document.getElementById('canvas');
    const snap = document.getElementById("snap");

    // Access webcam
    async function init() {
        const stream = await navigator.mediaDevices.getUserMedia({
            video: {
                width: 640, height: 480
            }
        });
        window.stream = stream;
        video.srcObject = stream;
    }

    // Draw image
    var context = canvas.getContext('2d');
    snap.addEventListener("click", function() {
        context.drawImage(video, 0, 0, 640, 480);
    });

    // Load init
    init();
})();