(function () {
    const mainWrapper = document.getElementById('main-wrapper');
    const userSidebar = document.getElementById('user-sidebar');
    
    const renderMessage = (message) => {
        const messageDiv = document.createElement('div');
        messageDiv.setAttribute('class', 'photo-message');
    
        messageDiv.innerHTML = message;
        mainWrapper.insertBefore(messageDiv, userSidebar);
    }
    
    const renderPhotos = (res) => {
        if (res.message === "No photos found") {
            renderMessage(res.message);
            return null;
        }
    
        let parentDiv = document.createElement('div');
        parentDiv.setAttribute('class', 'user-photos-row');
    
        i = 0;
        j = 0;
        while (i < res.photos.length) {
            const photoCard = document.createElement('div');
            photoCard.classList.add('user-photo-card');
        
            const photoImage = document.createElement('div');
            const image = document.createElement('img');

            const id = res.photos[i].id;
            image.setAttribute('src', '/api/photo/photo.php?id=' + id);
            image.setAttribute('style', 'object-fit: cover; width: 100%; height: 100%; border-radius: 3px;');

            
            const photoOptions = document.createElement('div');
            const photoOptionsSpan = document.createElement('span');
            const photoOptionsDel = document.createElement('span');
            const photoOptionsEdit = document.createElement('span');
            photoOptionsSpan.classList.add('wat');
            photoOptionsDel.setAttribute('class', 'fa fa-trash');
            photoOptionsEdit.setAttribute('class', 'fa fa-edit');
        
            photoOptions.classList.add('photo-options');
    
            mainWrapper.insertBefore(parentDiv, userSidebar);
            parentDiv.appendChild(photoCard);
        
            photoCard.appendChild(photoImage);
            photoCard.appendChild(photoOptions);
        
            photoImage.appendChild(image);
            photoOptions.appendChild(photoOptionsSpan);
            photoOptionsSpan.appendChild(photoOptionsDel);
            photoOptionsSpan.appendChild(photoOptionsEdit);
    
            if (j >= 2) {
                parentDiv = document.createElement('div');
                parentDiv.setAttribute('class', 'user-photos-row');
                parentDiv.setAttribute('id', 'user-photos-row');
                j = 0;
            } else {
                j++;
            }
            i++;
        }
    }
    
    async function initialize () {
        const photos = await window.fetchAPI('photo/get_photo.php');
        renderPhotos(photos);
    }
    
    window.onInitialized(() => initialize());
})();