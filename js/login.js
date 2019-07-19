const elRegister = document.getElementById('register');
const elUsername = document.getElementById('register-username');
const elEmail = document.getElementById('register-mail');
const elPassword = document.getElementById('register-password');
const elRepPassword = document.getElementById('register-reppassword');

elRegister.onclick = () => {
    if (elUsername.value === "") {
        return;
    }
    if (elEmail.value === "") {
        return;
    }
    if (elPassword.value === "") {
        return;
    }
    if (elRepPassword.value === "") {
        return;
    }
    if (elRepPassword.value !== elPassword.value) {
        return;
    }

    const userData = Array();
};