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
        if (flag === 0) {
            tiger.classList.toggle('selected');
            flag = 1;
        } else if (flag === 1) {
            tiger.classList.toggle('selected');
            flag = 0;
        }
    };

    house.onclick = () => {
        if (flag === 0) {
            house.classList.toggle('selected');
            flag = 2;
        } else if (flag === 2) {
            house.classList.toggle('selected');
            flag = 0;
        }
    };

    karate.onclick = () => {
        if (flag === 0) {
            karate.classList.toggle('selected');
            flag = 3;
        } else if (flag === 3) {
            karate.classList.toggle('selected');
            flag = 0;
        }
    };

    work.onclick = () => {
        if (flag === 0) {
            work.classList.toggle('selected');
            flag = 4;
        }else if (flag === 4) {
            work.classList.toggle('selected');
            flag = 0;
        }
    };

    // Load init
    init();
})();