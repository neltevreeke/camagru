(function () {
    const elPhotosContainer = document.getElementById('photos');
    let likesCache = null;

    async function getUsername (id) {
        return fetch('http://localhost:8100/api/user/get_user.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(id)
            })
        .then(res => res.json());
    }

    const checkLike = async (updatedFields) => {
        const res = await window.fetchAPI('photo/update_photo.php', {
            method: 'POST',
            body: updatedFields
        });

        return res.message;
    }

    const submitForm = async (updatedFields) => {
        const res = await window.fetchAPI('photo/update_photo.php', {
            method: 'POST',
            body: updatedFields
        });

        if (updatedFields.action === 'like' || updatedFields.action === 'unlike') {
            likesCache = document.getElementById('item-like-p-' + updatedFields.photoid);
            
            likesCache.innerHTML = res.likes;
    
            const itemLikeSpan = document.createElement('span');
            itemLikeSpan.setAttribute('class', 'fa fa-heart');
    
            likesCache.appendChild(itemLikeSpan);
        }

        if (updatedFields.action === 'comment') {
            // do stuff
            console.log(res);
        }
    }

    const handleCommentButtonClick = photo => async () => {
        const { id } = photo;
        // const { userid } = photo;

        const commentInputField = document.getElementById('item-comment-input-' + id);
        const commentValue = commentInputField.value;

        if (!commentValue) {
            // show error
            return;
        }

        if (commentValue.length > 30) {
            // show error
        }

        await submitForm({
            userid: window.user.id,
            photoid: id,
            action: 'comment',
            comment: commentValue
        });

       commentInputField.innerHTML = "";
    }

    const handlePhotoLike = photo => async () => {
        const { id } = photo;
        let action= 'like';

        if (!window.user) {
            return;
        }

        // check if liked photo is already liked if so, action = 'unlike';
        const res = await checkLike({
            userid: window.user.id,
            photoid: id,
        });

        if (res === "photo liked") {
            action = 'unlike';
        }

        await submitForm({
            userid: window.user.id,
            photoid: id,
            action: action
        });
    }

    const renderPhotos = (photos) => {
        photos.forEach(photo => {
            const { id } = photo;
            const { userid } = photo;
            const { likes } = photo;
            
            const mainItem = document.createElement('div');
            mainItem.setAttribute('class', 'main-item');

            elPhotosContainer.appendChild(mainItem);

            const itemHeader = document.createElement('div');
            const itemUsername = document.createElement('div');
            const itemUsernameh3 = document.createElement('h3');
            itemUsername.setAttribute('class', 'item-username');
            itemHeader.setAttribute('class', 'item-header');

            itemHeader.appendChild(itemUsername);
            itemUsername.appendChild(itemUsernameh3);

            getUsername(userid)
                .then(res => {
                    itemUsernameh3.innerHTML = res.username;
                });

            const itemLike = document.createElement('div');
            itemLike.setAttribute('class', 'item-like');

            itemHeader.appendChild(itemLike);

            const itemLikeP = document.createElement('p');
            itemLikeP.setAttribute('id', 'item-like-p-' + id);

            if (!likes) {
                itemLikeP.innerHTML = 0;
            } else {
                itemLikeP.innerHTML = likes;
            }
            
            const itemLikeSpan = document.createElement('span');
            itemLikeSpan.setAttribute('class', 'fa fa-heart');
            
            itemLikeP.appendChild(itemLikeSpan);
            itemLike.appendChild(itemLikeP);
            
            mainItem.appendChild(itemHeader);
            itemHeader.appendChild(itemLike);

            const pictureContainer = document.createElement('div');
            pictureContainer.setAttribute('class', 'photo-container');

            const pictureImage = document.createElement('img');
            pictureImage.setAttribute('style', 'width: 100%; height: auto;');
            pictureImage.setAttribute('src', '/api/photo/photo.php?id=' + id);
            pictureImage.addEventListener('dblclick', handlePhotoLike(photo));

            pictureContainer.appendChild(pictureImage);

            mainItem.appendChild(pictureContainer);

            // <div class = "item-comment">
            //     <p class = "username-comment">Klaasjan Petersen</p>
            //     <p class = "comment-content">Super mooi wauw</p>
            // </div>

            const itemCommentSection = document.createElement('div');
            if (window.user) {
                
                const itemCommentInput = document.createElement('input');
                itemCommentInput.setAttribute('placeholder', 'Add a comment...');
                itemCommentInput.setAttribute('id', 'item-comment-input-' + id);
                
                itemCommentSection.appendChild(itemCommentInput);
                
                const itemCommentButton = document.createElement('button');
                itemCommentButton.setAttribute('id', 'comment-input-button-' + id);
                itemCommentButton.setAttribute('class', 'comment-input-button');
                itemCommentButton.addEventListener('click', handleCommentButtonClick(photo));
                
                const itemCommentButtonSpan = document.createElement('span');
                itemCommentButtonSpan.setAttribute('class', 'fa fa-edit');
                
                itemCommentButton.appendChild(itemCommentButtonSpan);
                
                itemCommentSection.appendChild(itemCommentButton);
            }
            
            itemCommentSection.setAttribute('class', 'item-place-comment');
            mainItem.appendChild(itemCommentSection);

//

        });
    }

    async function init () {
        const res = await fetch('http://localhost:8100/api/photo/get_all_photos.php')
            .then(res => res.json());
        renderPhotos(res.photos);
    }

    init();

})();