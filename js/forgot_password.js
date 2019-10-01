const elForgotPasswordInput = document.getElementById('forgot-password-input');
const elForgotPasswordButton = document.getElementById('forgot-password-button');
const elForgotPasswordError = document.getElementById('forgot-password-error');

const showErrorMessage = (message) => {
    elForgotPasswordError.innerHTML = message;
}

const isValidEmail = (emailValue) => {
    const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(emailValue).toLowerCase());
}

const clearInputField = () => {
    elForgotPasswordInput.value = "";
}

function sendEmailToAPI(email) {
    fetch('http://localhost:8100/api/user/forgot_password.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(email)
        })
    .then(res => res.json())
    .then(res => {
        showErrorMessage(res.message + " to " + email);
    })
}

elForgotPasswordButton.addEventListener('click', () => {
    email = elForgotPasswordInput.value;

    if (!email) {
        showErrorMessage('Email is required');
        return null;
    }

    if (!isValidEmail(email)) {
        showErrorMessage('Email is not valid');
        return null;
    }

    sendEmailToAPI(email);

    clearInputField();
})