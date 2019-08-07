token = localStorage.getItem('token');
const elFooter = document.getElementById('footer');

const displayFooter = () => {
    elFooter.classList.add('footer-visible');
}

const hideFooter = () => {
    elFooter.classList.remove('footer-visible');
}

const determineLogin = () => {
    if (!token) {
        hideFooter();
        return null;
    } else {
        displayFooter();
    }
}

determineLogin();