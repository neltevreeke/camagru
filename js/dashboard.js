const mainWrapper = document.getElementById('main-wrapper');
const userSidebar = document.getElementById('user-sidebar');
const TOKEN_NAMESPACE = 'token';
const token = localStorage.getItem(TOKEN_NAMESPACE);
let user;

const getMe = () => {
    // !!token === token ? token : false;
    const isLoggedIn = !!token;

    if (!isLoggedIn) {
        return ;
    }

    fetch('http://localhost:8100/api/user/get_me.php', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'x-token': token
        }
    })
    .then(res => res.json())
    .then(res => {
        user = res;
        getPhotos(res.id)
    });
}

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
        image.setAttribute('src', res.photos[i].image);
        photoImage.classList.add('user-photo-image');
        
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

const getPhotos = (id) => {
    fetch('http://localhost:8100/api/photo/get_photo.php', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            id: id
        }
    })
    .then(res => res.json())
    .then(res => renderPhotos(res));
}

getMe();