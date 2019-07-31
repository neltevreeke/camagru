const elLogin = document.getElementById('login');

const renderLoginError = (errArr) => {
    const elErrDiv = document.getElementById('login-error');

    elErrDiv.innerHTML = errArr[0];
    errArr.length = 0;
}

elLogin.onclick = () => {
    const elLoginEmail = document.getElementById('login-mail');
    const elLoginPassword = document.getElementById('login-password');

    if (elLoginEmail.value === "") {
        errArr.push("Emailaddress can't be empty");
    }
    if (elLoginPassword.value === "") {
        errArr.push("Password can't be empty");
    }
    if (errArr.length > 0) {
        renderLoginError(errArr);
        return null;
    }

    // Make ajax object to send data to php api
    const dataLoginObject = {
        'email': elLoginEmail.value,
        'password': elLoginPassword.value
    }

    // Send ajax object to api
    fetch('http://localhost:8100/api/user/login_user.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(dataLoginObject)
        })
    .then(res => res.json())
    .then(res => console.log(res))


    // check if return values are correct



    // proceed to log in to user profile and redirect to user dashboard


};