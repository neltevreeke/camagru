(function () {
    const video = document.getElementById('video');
    const canvas = document.getElementById('canvas');
    const snap = document.getElementById("snap");
    const save = document.getElementById('save');

    const tiger = document.getElementById('tiger');
    const house = document.getElementById('house');
    const karate = document.getElementById('karate');
    const work = document.getElementById('work');
    let flag = 0;

    // const clickedImage = document.getElementsByTagName('IMG');

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

    // Draw image
    const context = canvas.getContext('2d');
    snap.addEventListener("click", function() {
        context.drawImage(video, 0, 0, 500, 480);
    });

    // Save image
    save.addEventListener("click", function () {
        canvas.toBlob(function(blob) {
            let formData = new FormData();
            formData.append("image", blob);

            window.fetchAPI('photo/upload_photo.php', {
                method: 'POST',
                body: formData
            });
        });
    });

    tiger.onclick = () => {
        tiger.classList.toggle('selected');
        flag = 1;
    };

    house.onclick = () => {
        house.classList.toggle('selected');
        flag = 2;
    };

    karate.onclick = () => {
        karate.classList.toggle('selected');
        flag = 3;
    };

    work.onclick = () => {
        work.classList.toggle('selected');
        flag = 4;
    };

    // Load init
    init();
})();