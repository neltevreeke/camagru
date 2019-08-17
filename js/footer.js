token = localStorage.getItem('token');
const elFooterCapture = document.getElementById('footer-capture');
const elFooterUpload = document.getElementById('footer-upload');

const displayFooter = () => {
    elFooterCapture.classList.add('footer-visible');
    elFooterUpload.classList.add('footer-visible');
}

const hideFooter = () => {
    elFooterCapture.classList.remove('footer-visible');
    elFooterUpload.classList.remove('footer-visible');
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