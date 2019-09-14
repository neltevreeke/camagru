(function () {
    const mainWrapper = document.getElementById('main-wrapper');
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

    const renderMessage = (message) => {
        const messageDiv = document.createElement('div');
        messageDiv.setAttribute('class', 'photo-message');
    
        messageDiv.innerHTML = message;
        mainWrapper.insertBefore(messageDiv, userSidebar);
    }

    // TODO: just use a foreach, don't use rows to create a grid layout, just use display: grid instead, check @ https://css-tricks.com/snippets/css/complete-guide-grid/
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
            photoOptionsDel.setAttribute('id', id);
            photoOptionsDel.addEventListener('click', deletePhotoClickHandler);

            photoOptionsEdit.setAttribute('class', 'fa fa-edit');
            photoOptionsEdit.setAttribute('id', 'edit-photo');
        
            photoOptions.classList.add('photo-options');
    
            mainWrapper.appendChild(parentDiv);
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

    const deletePhotoClickHandler = async () => {
        id = event.target.id;

        const res = await window.fetchAPI('photo/delete_photo.php', {
            method: 'POST',
            body: id
        });

        if (res.message !== 'Success') {
            return null;
        }

        renderPhotos();
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
        const photos = await window.fetchAPI('photo/get_photo.php');
        renderPhotos(photos);
        renderAccountDetails();
    }

    window.onInitialized(() => initialize());
})();