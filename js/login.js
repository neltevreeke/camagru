const elRegister = document.getElementById('register');
const elLogin = document.getElementById('login');
const errArr = [];

const createErrDiv = () => {
    const elErrDiv = document.createElement("div");
    elErrDiv.setAttribute('class', 'register-error');

    return elErrDiv;
}

const renderRegisterError = (errArr) => {
    const elErrDiv = document.getElementById('register-error');

    elErrDiv.innerHTML = errArr[0];
    errArr.length = 0;
}

const renderLoginError = (errArr) => {
    const elErrDiv = document.getElementById('login-error');

    elErrDiv.innerHTML = errArr[0];
    errArr.length = 0;
}

elRegister.onclick = () => {
    const elRegisterUsername = document.getElementById('register-username');
    const elRegisterEmail = document.getElementById('register-mail');
    const elRegisterPassword = document.getElementById('register-password');
    const elRegisterRepPassword = document.getElementById('register-reppassword');

    if (elRegisterUsername.value === "") {
        errArr.push("Username can't be empty");
    }
    if (elRegisterEmail.value === "") {
        errArr.push("Emailaddress can't be empty");
    }
    if (elRegisterPassword.value === "") {
        errArr.push("Password can't be empty");
    }
    if (elRegisterRepPassword.value !== elRegisterPassword.value) {
        errArr.push("Passwords do not match");
    }
    if (errArr.length > 0) {
        renderRegisterError(errArr);
    }

    // console.log('send ajax oject to php api');
};

elLogin.onclick = () => {
    const elLoginEmail = document.getElementById('login-mail');
    const elLoginPassword = document.getElementById('login-password');

    if (elLoginEmail === "") {
        errArr.push("Emailaddress can't be empty");
    }
    if (elLoginPassword === "") {
        errArr.push("Password can't be empty");
    }
    if (errArr.length > 0) {
        renderLoginError(errArr);
    }
};