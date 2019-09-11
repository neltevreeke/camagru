token = localStorage.getItem('token');
activeMenu = localStorage.getItem('activeMenu');

const elMenu = document.getElementById('menu');
let linkArr = [];


const renderMenuItems = () => {
    if (!activeMenu) {
        activeMenu = 'http://localhost:8100/index.php';
    }

    if (!token && activeMenu === "logout") {
        activeMenu = 'index';
    }

    if (token && activeMenu === "login") {
        activeMenu = 'dashboard';
    }

    for (let i = 0; i < linkArr.length; i++) {
        const aTag = document.createElement('a');
        aTag.setAttribute('href', linkArr[i] + '.php');

        if (linkArr[i] === activeMenu) {
            aTag.classList.add('active');
        }

        const newContent = document.createTextNode(linkArr[i]);
        aTag.appendChild(newContent);

        elMenu.appendChild(aTag);
        linkArr[i] = aTag;
    }
}

const menuAddEvents = () => {
    for (let i = 0; i < linkArr.length; i++) {
        linkArr[i].addEventListener("click", function() {
            linkArr[i].className += 'active';
            localStorage.setItem('activeMenu', linkArr[i].innerHTML);
        });
    }
}

if (!token) {
    linkArr.push("index");
    linkArr.push("login");

    renderMenuItems();
    menuAddEvents();
} else {
    linkArr.push("index");
    linkArr.push("dashboard");
    linkArr.push("logout");
    
    renderMenuItems();
    menuAddEvents();
}
