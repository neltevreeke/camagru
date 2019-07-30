const elRegister = document.getElementById('register');
const errArr = [];

const renderRegisterError = (errArr) => {
    const elErrDiv = document.getElementById('register-error');

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
        return null;
    }

    // Make ajax object to send data to php api
    const dataRegisterObject = {
        'username': elRegisterUsername.value,
        'emailaddress': elRegisterEmail.value,
        'password': elRegisterPassword.value
    }

    // Posting data to api and checking return values are good to go
    // Displaying error message if thats not the case
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
