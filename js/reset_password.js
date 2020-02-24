const elResetPasswordInput = document.getElementById('reset-password-input');
const elResetPasswordRepeatInput = document.getElementById('reset-password-repeat-input');
const elResetPasswordButton = document.getElementById('reset-password-button');
const elResetPasswordError = document.getElementById('reset-password-error');

const getQueryVariable = (variable) => {
    let query = window.location.search.substring(1);
    let vars = query.split("&");

    for (let i = 0; i < vars.length; i++) {
        let pair = vars[i].split("=");

        if (pair[0] == variable) {
            return pair[1];
        }
    }

    return(false);
}

const showValidationError = (message) => {
    elResetPasswordError.innerHTML = message;
}

const submitForm =  (updatedFields) => {
    fetch('http://localhost:8100/api/user/update_user.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedFields),
        })
    .then(res => res.json())
    .then(res => {
        window.location.href = 'http://localhost:8100/login.php';
    })
}

elResetPasswordButton.onclick = () => {
    const get = getQueryVariable('code');

    if (!get) {
        showValidationError("Your password reset token is invalid")
        return
    }

    if (elResetPasswordInput.value.length < 6) {
        showValidationError("Password requires at least 6 characters");
        return
    }
    if (elResetPasswordRepeatInput.value !== elResetPasswordInput.value) {
        showValidationError("Passwords do not match");
        return
    }

    submitForm({
        password: elResetPasswordInput.value,
        get
    });
}
