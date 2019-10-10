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

    const emptyInputField = (commentValue, id) => {
        const itemCommentButton = document.getElementById('comment-input-button-' + id);

        itemCommentButton.style.backgroundColor = 'red';
        commentValue = "";
    }

    const handleDeleteCommentClick = comment => async () => {
        const mainItem = event.target.parentNode.parentNode.parentNode;
        const allItemCommentsWrap = document.getElementById('all-item-comments-' + comment.photoId);
        const deletedComment = comment.user_id + ":" + comment.comment;

        await submitForm({
            userid: comment.user_id,
            photoid: comment.photoId,
            action: 'uncomment',
            comment: comment.comment
        });

        
        const removeComment = (allComments, deletedComment) => allComments
        .split('|')
        .filter(comment => comment != deletedComment)
        .join('|');
 
        commentCache = commentCache.map((photo, id) => {
            if (id == comment.photoId - 1) {
                return {...photo, comment_info: removeComment(photo.comment_info, deletedComment)};
            } else {
                return photo;
            }
        });
        
        let singlePhotoComments = commentCache[comment.photoId - 1].comment_info.split('|');
        console.log(`Deleting commment ${deletedComment}, ${commentCache[comment.photoId - 1].comment_info} becomes ${removeComment(commentCache[comment.photoId - 1].comment_info, deletedComment)}`);
        console.log(singlePhotoComments, commentCache);
        // singlePhotoComments = singlePhotoComments.filter(c => c !== deletedComment);
        allItemCommentsWrap.innerHTML = "";

        singlePhotoComments.forEach(comment => {
            console.log(comment);
            let tmpComment = renderComments(comment, mainItem);
            allItemCommentsWrap.appendChild(tmpComment);
        });
    }

    const handleCommentButtonClick = (photo, mainItem) => async () => {
        const { id } = photo;

        const commentInputField = document.getElementById('item-comment-input-' + id);
        let commentValue = commentInputField.value;

        if (!commentValue) {
            emptyInputField(commentValue, id);
            return;
        }

        if (commentValue.length > 20) {
            emptyInputField(commentValue, id);
            return;
        }

        await submitForm({
            userid: window.user.id,
            photoid: id,
            action: 'comment',
            comment: commentValue
        });

        let newComment = window.user.id + ":" + commentValue;

        commentCache = commentCache.map((photo, idx) => {
            if (idx == id - 1) {
                console.log('Got here');
                return {...photo, comment_info: photo.comment_info + "|" + newComment };
            } else {
                return photo;
            }
        });
        console.log("Updated", commentCache);

        const allItemCommentsWrap = document.getElementById('all-item-comments-' + id);
        allItemCommentsWrap.appendChild(renderComments(newComment, mainItem));
        commentValue = "";
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

    const renderComments = (comment, mainItem) => {
        let tmp = null;
        tmp = comment.split(':');
        
        commentObj = {
            user_id: tmp[0],
            comment: tmp[1],
            photoId: mainItem.dataset.indexNumber
        }
        
        const itemCommentWrap = document.createElement('div');
        itemCommentWrap.setAttribute('class', 'item-comment');
        
        const itemCommentUsername = document.createElement('p');
        itemCommentUsername.setAttribute('class', 'username-comment');
        
        itemCommentWrap.appendChild(itemCommentUsername);
        
        getUsername(commentObj.user_id)
        .then(res => {
            itemCommentUsername.innerHTML = res.username;
        });
        
        const itemCommentContent = document.createElement('p');
        itemCommentContent.setAttribute('class', 'comment-content');
        
        itemCommentContent.innerHTML = commentObj.comment;
        
        itemCommentWrap.appendChild(itemCommentContent);
        
        if (commentObj.user_id === window.user.id) {
            const itemCommentDeleteButton = document.createElement('span');
            itemCommentDeleteButton.setAttribute('class', 'fa fa-trash');
            itemCommentDeleteButton.addEventListener('click', handleDeleteCommentClick(commentObj));

            itemCommentWrap.appendChild(itemCommentDeleteButton);
        }

        return itemCommentWrap;
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
                let commentArr = comment_info.split('|');
                const allItemComments = document.createElement('div');

                allItemComments.setAttribute('id', 'all-item-comments-' + id);

                commentArr.forEach(comment => {
                    let tmpComment = renderComments(comment, mainItem);

                    allItemComments.appendChild(tmpComment);
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

    async function init () {
        const res = await fetch('http://localhost:8100/api/photo/get_all_photos.php')
            .then(res => res.json());
        
        commentCache = res.photos;

        // comment info omzetten naar array / object

        renderPhotos(res.photos);
    }

    init();

})();