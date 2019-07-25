
const createLoginObject = (emailValue, passwordValue) => {
    const dataObject = {
        'email': emailValue,
        'password': passwordValue
    }

    xhttp = new XMLHttpRequest();
    xhttp.open('POST', 'login_process.php', true);

    xhttp.onload = () => {
        if (xhttp.status === 400) {
            console.log(xhttp.response);
            console.log(xhttp.responseText);
        }
    };

    xhttp.setRequestHeader('Content-type', 'application/json');
    xhttp.send(JSON.stringify(dataObject));

    window.location.href = "http://localhost:8100/login_process.php";
    console.log('data send successfully');
}

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
    const loginObject = createLoginObject(elLoginEmail.value, elLoginPassword.value);


    // Send ajax object to api



    // check if return values are correct



    // proceed to log in to user profile and redirect to user dashboard


};