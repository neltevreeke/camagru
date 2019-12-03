const elRegister = document.getElementById('register');
const errArr = [];

const renderRegisterError = (errArr) => {
    const elErrDiv = document.getElementById('register-error');

    elErrDiv.innerHTML = errArr[0];
    errArr.length = 0;
}

const validateEmail = (emailValue) => {
    const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(emailValue).toLowerCase());
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
    if (!validateEmail(elRegisterEmail.value)) {
        errArr.push("The email you have entered is not valid");
    }
    if (elRegisterPassword.value === "") {
        errArr.push("Password can't be empty");
    }
    if (elRegisterRepPassword.value !== elRegisterPassword.value) {
        errArr.push("Passwords do not match");
    }
    if (elRegisterPassword.value.length < 6) {
        errArr.push("Password requires at least 6 characters");
    }
    if (errArr.length > 0) {
        renderRegisterError(errArr);
        return null;
    }

    const dataRegisterObject = {
        'username': elRegisterUsername.value,
        'emailaddress': elRegisterEmail.value,
        'password': elRegisterPassword.value
    }

    fetch('http://localhost:8100/api/user/create_user.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(dataRegisterObject)
        })
    .then(res => res.json())
    .then(res => {
        if (res.message === "Username already in use") {
            errArr.push("Username already in use");
        } else if (res.message === "Email already in use") {
            errArr.push("Email already in use");
        }
        if (res.message === "User successfully created") {
            errArr.push("An email has been sent to " + elRegisterEmail.value + " for verification");
        }
        if (errArr.length > 0) {
            renderRegisterError(errArr);
            return null;
        } 
    })
};
