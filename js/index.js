(function () {
    const elPhotosContainer = document.getElementById('photos');
    let likesCache = null;
    let commentCache = null;

    const checkLike = async (updatedFields) => {
        const res = await window.fetchAPI('photo/update_photo.php', {
            method: 'POST',
            body: updatedFields
        });

        return res.message;
    }

    const submitForm = async (updatedFields) => {
        const commentInputField = document.getElementById('item-comment-input-' + updatedFields.photoid);

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
            if (res.message !== 'Success') {
                return null;
            }

            commentInputField.value = "";

            return res.newCommentId;
        }

        if (updatedFields.action === 'uncomment') {
            if (res.message !== 'Success') {
                return false;
            }

            return true;
        }
    }

    const emptyInputField = (commentValue) => {
        commentValue = "";
    }

    const commentInputError = (id) => {
        const itemCommentButton = document.getElementById('comment-input-button-' + id);

        itemCommentButton.style.backgroundColor = 'red';
    }

    const updateCommentCache = (updatedFields, id) => {

        if (updatedFields.action === 'comment') {
            commentCache.map((photo, idx) => {
                if (commentCache[idx].id === id) { // hier komt ie noooit in (dus update werkt niet goed)
                    photo.comments.push({
                        id: updatedFields.id,
                        comment: updatedFields.value,
                        username: window.user.username
                    });
                } else {
                    return photo;
                }
            });
        }

        if (updatedFields.action === 'uncomment') {
            commentCache.map((photo, idx) => {
                if (commentCache[idx].id === id) {
                    photo.comments.map((comment, idx) => {
                        if (updatedFields.id === comment.id) {
                            photo.comments = photo.comments.filter(c => c.id !== updatedFields.id);
                        } else {
                            return photo;
                        }

                    })
                }
            })
        }
    }

    const validateCommentInput = (commentValue, id) => {
        if (!commentValue) {
            emptyInputField(commentValue);
            commentInputError(id);
            return false;
        }

        if (commentValue.length > 20) {
            emptyInputField(commentValue);
            commentInputError(id);
            return false;
        }

        return true;
    }

    const handleDeleteCommentClick = (comment) => async () =>{
        const photoId = event.target.parentNode.parentNode.parentNode.dataset.indexNumber;
        const allItemCommentsWrap = document.getElementById('all-item-comments-' + photoId);

        const res = await submitForm({
            id: comment.id,
            username: comment.username,
            value: comment.comment,
            action: 'uncomment'
        });

        if (!res) {
            return ;
        }

        updateCommentCache({
            id: comment.id,
            username: window.user.username,
            value: comment.comment,
            action: 'uncomment'
        }, photoId);

        commentCache.map((photo, idx) => {
            if (commentCache[idx].id === photoId) {
                if (!commentCache[idx].comments) {
                    return;
                }

                allItemCommentsWrap.innerHTML = "";

                commentCache[idx].comments.forEach(comment => {
                    let tmpComment = getCommentElem(comment);
                    allItemCommentsWrap.appendChild(tmpComment);
                })
            } else {
                return photo;
            }
        })
    }

    const handleCommentButtonClick = (photo) => async () => {
        const { id } = photo;

        const commentInputField = document.getElementById('item-comment-input-' + id);
        let commentValue = commentInputField.value;

        const allCommentsWrap = document.getElementById('all-item-comments-' + id);

        if (!validateCommentInput(commentValue, id)) {
            return;
        }

        const newCommentId = await submitForm({
            userid: window.user.id,
            photoid: id,
            action: 'comment',
            comment: commentValue
        });

        updateCommentCache({
            id: newCommentId,
            value: commentValue,
            action: 'comment'
        }, id);

        const newCommentDiv = getCommentElem({
            id: newCommentId,
            username: window.user.username,
            comment: commentValue
        });

        allCommentsWrap.appendChild(newCommentDiv);
    }

    const handlePhotoLike = photo => async () => {
        const { id } = photo;
        let action= 'like';

        if (!window.user) {
            return;
        }

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

    const getCommentElem = (comment) => {
        const { username } = comment;

        const itemComment = document.createElement('div');
        const itemCommentUsername = document.createElement('p');

        itemCommentUsername.setAttribute('class', 'username-comment');
        itemComment.setAttribute('class', 'item-comment');
        itemComment.appendChild(itemCommentUsername);

        itemCommentUsername.innerHTML = username;

        const itemCommentContent = document.createElement('p');
        itemCommentContent.setAttribute('class', 'comment-content');
        itemCommentContent.innerHTML = comment.comment;
        itemComment.appendChild(itemCommentContent);

        if (window.user) {
            if (comment.username === window.user.username) {
                const itemCommentDeleteButton = document.createElement('span');
                itemCommentDeleteButton.setAttribute('class', 'fa fa-trash');
                itemCommentDeleteButton.addEventListener('click', handleDeleteCommentClick(comment));
    
                itemComment.appendChild(itemCommentDeleteButton);
            }
        }

        return itemComment;
    }

    const renderPhotos = (photos) => {
        if (!photos) {
            return null;
        }

        photos.forEach(photo => {
            const { id } = photo;
            const { comments } = photo;
            const { likes } = photo;
            const { username } = photo;

            const mainItem = document.createElement('div');
            mainItem.setAttribute('class', 'main-item');
            mainItem.setAttribute('data-index-number', id);

            elPhotosContainer.appendChild(mainItem);

            const itemHeader = document.createElement('div');
            const itemUsername = document.createElement('div');
            const itemUsernameh3 = document.createElement('h3');
            itemUsername.setAttribute('class', 'item-username');
            itemHeader.setAttribute('class', 'item-header');

            itemUsernameh3.innerHTML = username;

            itemHeader.appendChild(itemUsername);
            itemUsername.appendChild(itemUsernameh3);

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

            if (comments) {
                const allItemComments = document.createElement('div');
                allItemComments.setAttribute('id', 'all-item-comments-' + id);

                comments.forEach(comment => {
                    let itemComment = getCommentElem(comment, mainItem);

                    allItemComments.appendChild(itemComment);
                });

                mainItem.appendChild(allItemComments);
            }

            const itemCommentSection = document.createElement('div');
            if (window.user) {
                
                const itemCommentInput = document.createElement('input');
                itemCommentInput.setAttribute('placeholder', 'Add a comment of max 20 characters');
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
            itemCommentSection.setAttribute('id', 'item-place-comment-' + id);
            mainItem.appendChild(itemCommentSection);
        });
    }

    async function init () {
        const res = await fetch('http://localhost:8100/api/photo/get_all_photos.php')
            .then(res => res.json());

        commentCache = res.photos;

        renderPhotos(res.photos);
    }

    window.onInitialized(() => init());

})();
