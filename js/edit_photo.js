(function () {
    const elPhotoContainer = document.getElementById('edit-photo-container');
    const elUpdatePhotoButton = document.getElementById('edit-photo-update-button');
    const elOverlayError = document.getElementById('overlay-error');
    const elWatermarkButtons = document.getElementsByClassName('watermarkButton');

    let selectedWatermarkType = null;
    let elSelectedWatermarkType = null;
    let photoId = null;

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

    const showErrorMessage = (message) => {
        elOverlayError.innerHTML = message;
    }

    elUpdatePhotoButton.addEventListener('click', () => {
        if (!selectedWatermarkType) {
            showErrorMessage('No overlay image selected');
            return null;
        }

        let formData = new FormData();
        formData.append('watermark', selectedWatermarkType);
        formData.append('photoId', photoId);

        window.fetchAPI('photo/edit_photo.php', {
            method: 'POST',
            body: formData
        }).then(res => {
            if (res.message == 'Success') {
                window.location.href = 'http://localhost:8100/dashboard.php';
            }
        });
    })

    const getQueryVariable = (variable) => {
        let query = window.location.search.substring(1);
        let vars = query.split("&");
    
        for (let i = 0; i < vars.length; i++) {
            let pair = vars[i].split("=");
    
            if (pair[0] == variable) {
                return pair[1];
            }
        }

        return(false);
    }

    const renderPhoto = (id) => {
        const image = document.createElement('img');
            
        image.setAttribute('src', '/api/photo/photo.php?id=' + id);
        image.setAttribute('style', 'object-fit: cover; width: 100%; height: 100%; border-radius: 3px; border: 1px solid black');

        elPhotoContainer.insertBefore(image, elUpdatePhotoButton);
    }


    function initialize () {
        const token = localStorage.getItem('token')

        if(!token) {
            window.location.href = 'http://localhost:8100/login.php'
        }

        photoId = getQueryVariable('photoid');

        renderPhoto(photoId);
    }

    window.onInitialized(() => initialize());
})();