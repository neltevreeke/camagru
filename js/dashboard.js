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
        elPhotos.appendChild(messageDiv);
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
            photoOptionsEdit.addEventListener('click', handleEditPhotoClick(photo));

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

    const handleEditPhotoClick = photo => async () => {
        const { id } = photo;

        window.location.href = 'http://localhost:8100/edit_photo.php?photoid=' + id;
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

    const handleCheckboxClick = async () => {
        const notificationButton = document.getElementById('checkbox-input-value');

        if (!notificationButton.checked && window.user.notifications == 1) {

            await submitForm({
                notifications: 0
            });

            window.user.notifications = 0;
        }

        if (notificationButton.checked && window.user.notifications == 0) {

            await submitForm({
                notifications: 1
            });

            window.user.notifications = 1;
        }
    }

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

    const renderNotificationsCheckbox = () => {
        userDetailsSection = document.getElementById('user-details-section');

        notificationsTitle = document.createElement('p');
        notificationsTitle.setAttribute('class', 'user-details-title');
        notificationsTitle.innerHTML = 'Receive email on comment:';

        notificationsCheckboxP = document.createElement('p');
        notificationsCheckbox = document.createElement('input');
        notificationsCheckbox.setAttribute('type', 'checkbox');
        notificationsCheckbox.setAttribute('id', 'checkbox-input-value');

        notificationsCheckbox.addEventListener('click', handleCheckboxClick);

        notificationsCheckboxP.appendChild(notificationsCheckbox);
        notificationsCheckboxP.insertAdjacentHTML('beforeend', 'Yes, I want to.');

        if (window.user.notifications == 1) {
            notificationsCheckbox.checked = true;
        }

        if (window.user.notifications == 0) {
            notificationsCheckbox.checked = false;
        }

        userDetailsSection.appendChild(notificationsTitle);
        userDetailsSection.appendChild(notificationsCheckboxP);
    }

    async function initialize () {
        if (!window.user) {
            window.location.href = 'http://localhost:8100/login.php'
        }

        renderAccountDetails();

        const res = await window.fetchAPI('photo/get_photo.php');

        if (res && res.message === "No photos found") {
            renderMessage(res.message);
            return null;
        }

        renderNotificationsCheckbox();

        res.photos.reverse();

        photosCache = res.photos;

        renderPhotos(res.photos);
    }

    window.onInitialized(() => initialize());
})();
