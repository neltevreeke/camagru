const TOKEN_NAMESPACE = 'token';

const token = localStorage.getItem(TOKEN_NAMESPACE);

const getMe = () => {
    // !!token === token ? token : false;
    const isLoggedIn = !!token;

    if (!isLoggedIn) {
        return ;
    }

    fetch('http://localhost:8100/api/user/get_me.php', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'x-token': token
        }
    })
    .then(res => res.json())
    .then(res => console.log(res.email));
}

getMe();
