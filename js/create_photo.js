(function () {
    const video = document.getElementById('video');
    const canvas = document.getElementById('canvas');
    const snap = document.getElementById("snap");
    const save = document.getElementById('save');

    const elError = document.getElementById('overlay-error');
    const elWatermarkButtons = document.getElementsByClassName('watermarkButton');

    let selectedWatermarkType = null;
    let elSelectedWatermarkType = null;

    const onWatermarkButtonClick = (event) => {
        if (elSelectedWatermarkType !== null) {
            elSelectedWatermarkType.classList.remove('selected');
        }

        const watermarkType = event.target.getAttribute('data-watermark-type').toUpperCase();
        selectedWatermarkType = watermarkType;
        elSelectedWatermarkType = event.target;
        elSelectedWatermarkType.classList.add('selected');
    }

    Array.from(elWatermarkButtons).forEach(function(elWatermarkButton) {
        elWatermarkButton.addEventListener('click', onWatermarkButtonClick);
    });

    // Draw image
    const context = canvas.getContext('2d');
    snap.addEventListener("click", function() {
        context.drawImage(video, 0, 0, 500, 480);
    });

    const showErrorMessage = (message) => {
        elError.innerHTML = message;
    }

    const isCanvasBlank = (canvas) => {
        const pixelBuffer = new Uint32Array(
            context.getImageData(0, 0, canvas.width, canvas.height).data.buffer
        );

        return !pixelBuffer.some(color => color !== 0);
    }

    // Save image and watermarktype
    save.addEventListener("click", () => {
        if (!selectedWatermarkType) {
            showErrorMessage('No overlay image selected');
            return null;
        }

        if (isCanvasBlank(canvas)) {
            showErrorMessage('Capture an image first');
            return null;
        }

        canvas.toBlob((blob) => {
            let formData = new FormData();
            formData.append('image', blob);
            formData.append('watermark', selectedWatermarkType);

            window.fetchAPI('photo/upload_photo.php', {
                method: 'POST',
                body: formData
            }).then(res => {
                if (res.message == 'Success') {
                    window.location.href = 'http://localhost:8100/dashboard.php';
                }
            });
        });
    });

    // Access webcam
    async function init() {
        const stream = await navigator.mediaDevices.getUserMedia({
            video: {
                width: 500, height: 480
            }
        });
        window.stream = stream;
        video.srcObject = stream;
    }

    // Load init
    init();
})();