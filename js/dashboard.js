(function () {
    const elPhotos = document.getElementById('photos');
    const userSidebar = document.getElementById('user-sidebar');

    const elUserTitle = document.getElementById('user-title');
    const elUserDetailsUsername = document.getElementById('user-details-username');
    const elUserDetailsEmail = document.getElementById('user-details-email');
    
    const errorField = document.getElementById('change-details-error');

    const newUsernameButton = document.getElementById('change-username');
    const newUsername = document.getElementById('new-username-value');

    const newEmailButton = document.getElementById('change-email');
    const newEmail = document.getElementById('new-email-value');

    const newPasswordButton = document.getElementById('change-password');
    const newPassword = document.getElementById('new-password-value');
    const newPasswordRepeat = document.getElementById('new-password-repeat-value');

    let photosCache = null;

    const renderMessage = (message) => {
        const messageDiv = document.createElement('div');
        messageDiv.setAttribute('class', 'photo-message');
        messageDiv.setAttribute('class', 'photos');
    
        messageDiv.innerHTML = message;
        elPhotos.insertBefore(messageDiv, userSidebar);
    }

    const renderPhotos = (photos) => {

        elPhotos.innerHTML = "";
        
        photos.forEach(photo => {
            const { id } = photo;

            const photoCard = document.createElement('div');
            photoCard.classList.add('user-photo-card');

            const photoImage = document.createElement('div');
            const image = document.createElement('img');
            
            image.setAttribute('src', '/api/photo/photo.php?id=' + id);
            image.setAttribute('style', 'object-fit: cover; width: 100%; height: 100%; border-radius: 3px;');

            const photoOptions = document.createElement('div');
            const photoOptionsSpan = document.createElement('span');
            const photoOptionsDel = document.createElement('span');
            const photoOptionsEdit = document.createElement('span');
            photoOptionsSpan.classList.add('wat');
            photoOptionsDel.setAttribute('class', 'fa fa-trash');
            photoOptionsDel.setAttribute('id', id);

            photoOptionsDel.addEventListener('click', handleDeletePhotoClick(photo));
            photoOptionsEdit.setAttribute('class', 'fa fa-edit');
            photoOptionsEdit.setAttribute('id', 'edit-photo');
        
            photoOptions.classList.add('photo-options');
            photoCard.appendChild(photoImage);
            photoCard.appendChild(photoOptions);

            photoImage.appendChild(image);
            photoOptions.appendChild(photoOptionsSpan);
            photoOptionsSpan.appendChild(photoOptionsDel);
            photoOptionsSpan.appendChild(photoOptionsEdit);

            elPhotos.appendChild(photoCard);
        });
    }

    const handleDeletePhotoClick = photo => async () => {
        const { id } = photo;
        
        const res = await window.fetchAPI('photo/delete_photo.php', {
            method: 'POST',
            body: id
        });

        if (res.message !== 'Success') {
            return null;
        }

        photosCache = photosCache.filter(p => p.id !== id);

        renderPhotos(photosCache);
    }

    const renderAccountDetails = () => {
        elUserTitle.innerHTML = "Welcome, " + window.user.username + "!";
        elUserDetailsUsername.innerHTML = window.user.username;
        elUserDetailsEmail.innerHTML = window.user.email;
    }

    // TODO: move this into a new "validation.js" file, so it becomes window.isValidEmail
    const isValidEmail = (emailValue) => {
        const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(emailValue).toLowerCase());
    }

    const showValidationError = message => {
        errorField.innerHTML = message;
    }

    const emptyInputFields = () => {
        newUsername.value = "";
        newEmail.value = "";
        newPassword.value = "";
        newPasswordRepeat.value = "";

        if (flag) {
            errorField.innerHTML = "";
        }
    }

    const submitForm = async (updatedFields) => {
        flag = true;

        const res = await window.fetchAPI('user/update_user.php', {
            method: 'POST',
            body: updatedFields
        });

        window.user = res.user;

        if (res.message != "Success") {
            flag = false;

            showValidationError(res.message);
            emptyInputFields(flag);
            return null;
        }

        renderAccountDetails();
        emptyInputFields(flag);
    }

    newUsernameButton.addEventListener('click', async function () {
        if (newUsername.value === "") {
            return showValidationError("Username can't be empty.");
        }

        await submitForm({
            username: newUsername.value
        });
    });

    newEmailButton.addEventListener('click', async function () {
        if (newEmail.value === "") {
            return showValidationError("Email can't be empty.");
        } else if (!isValidEmail(newEmail.value)) {
            return showValidationError("Enter a valid email.");
        }

        await submitForm({
            email: newEmail.value
        });        
    });

    newPasswordButton.addEventListener('click', async function () {
        if (newPassword.value === '') {
            return showValidationError("Password can't be empty.");
        } else if (newPasswordRepeat.value === "") {
            return showValidationError("Repeat password can't be empty.");
        } else if (newPassword.value.length <= 5) {
            return showValidationError("Password requires at least 6 characters.");
        } else if (newPassword.value !== newPasswordRepeat.value) {
            return showValidationError("Passwords do not match.");
        }

        await submitForm({
            password: newPassword.value
        });
    });
        
    async function initialize () {
        renderAccountDetails();

        const res = await window.fetchAPI('photo/get_photo.php');
        
        if (res && res.message === "No photos found") {
            renderMessage(photos.message);
            return null;
        }

        photosCache = res.photos;

        renderPhotos(res.photos);
    }

    window.onInitialized(() => initialize());
})();