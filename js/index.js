(function () {
    const elPhotosContainer = document.getElementById('photos');
    let likesCache = null;
    let commentCache = null;

    async function getUsername (id) {
        return await fetch('http://localhost:8100/api/user/get_user.php', {
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
                console.log('error');
            }

            commentInputField.value = "";
        }
    }

    const emptyInputField = (commentValue) => {
        commentValue = "";
    }

    const commentInputError = (id) => {
        const itemCommentButton = document.getElementById('comment-input-button-' + id);

        itemCommentButton.style.backgroundColor = 'red';
    }

    const updateCommentCache = (commentValue, photo, id) => {
        console.log(photo);
        commentCache = commentCache.map((photo, idx) => {
            if (idx === id - 1) {
                return {
                    ...photo,
                    comment_info: 
                        photo.comment_info.push({
                            userId: window.user.id,
                            value: commentValue
                        }) 
                }
            } else {
                return photo;
            }
        });
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
    }

    const handleCommentButtonClick = (photo) => async () => {
        const { id } = photo;

        const commentInputField = document.getElementById('item-comment-input-' + id);
        let commentValue = commentInputField.value;

        const allCommentsWrap = document.getElementById('all-item-comments-' + id);

        if (!validateCommentInput(commentValue, id)) {
            return;
        }

        await submitForm({
            userid: window.user.id,
            photoid: id,
            action: 'comment',
            comment: commentValue
        });

        // get newCommentID, nodig ivm deleteComment?
        // const res = window.fetchAPI('photo/')

        updateCommentCache(commentValue, photo, id);

        const newCommentDiv = renderComments({
            userId: window.user.id,
            value: commentValue
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

    const renderComments = (comment) => {
        const itemComment = document.createElement('div');
        const itemCommentUsername = document.createElement('p');

        itemCommentUsername.setAttribute('class', 'username-comment');
        itemComment.setAttribute('class', 'item-comment');
        itemComment.appendChild(itemCommentUsername);

        getUsername(comment.userId)
        .then(res => {
            itemCommentUsername.innerHTML = res.username;
        });

        const itemCommentContent = document.createElement('p');
        itemCommentContent.setAttribute('class', 'comment-content');
        itemCommentContent.innerHTML = comment.value;
        itemComment.appendChild(itemCommentContent);

        if (window.user) {
            if (comment.userId === window.user.id) {
                const itemCommentDeleteButton = document.createElement('span');
                itemCommentDeleteButton.setAttribute('class', 'fa fa-trash');
                // itemCommentDeleteButton.addEventListener('click', handleDeleteCommentClick(commentObj));
    
                itemComment.appendChild(itemCommentDeleteButton);
            }
        }

        return itemComment;
    }

    const renderPhotos = (photos) => {
        photos.forEach(photo => {
            const { id } = photo;
            const { userid } = photo;
            const { likes } = photo;
            const { comment_info } = photo;

            const mainItem = document.createElement('div');
            mainItem.setAttribute('class', 'main-item');
            mainItem.setAttribute('data-index-number', id);

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

                        
            if (comment_info) {
                const allItemComments = document.createElement('div');
                allItemComments.setAttribute('id', 'all-item-comments-' + id);

                comment_info.forEach(comment => {
                    let itemComment = renderComments(comment, mainItem);

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
                itemCommentButton.addEventListener('click', handleCommentButtonClick(photo, mainItem));
                
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

    const convertCommentToObj = (comment) => {
        let commentObj = comment.split('|');
        
        commentObj = commentObj.map((comment) => {
            comment = comment.split(':');
            return {
                id: comment[0],
                userId: comment[1],
                value: comment[2]
            }
        })

        return commentObj;
    }

    async function init () {
        const res = await fetch('http://localhost:8100/api/photo/get_all_photos.php')
            .then(res => res.json());

        res.photos = res.photos.map((photo) => {
            if (photo.comment_info) {
                return {
                    ...photo,
                    comment_info: convertCommentToObj(photo.comment_info)
                }
            } else {
                return photo;
            }
        });

        commentCache = res.photos;

        renderPhotos(res.photos);
    }

    init();

})();
