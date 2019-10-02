window.user = null;

(function () {
    let isInitialized = false;
    let listeners = [];

    async function getMe () {
        // !!token === token ? token : false;
        const isLoggedIn = !!token;
    
        if (!isLoggedIn) {
            return;
        }

        const res = await window.fetchAPI('user/get_me.php');
        window.user = res;
        isInitialized = true;
        triggerListeners();
    }

    function triggerListeners () {
        for (let i = 0, l = listeners.length; i < l; i++) {
            listeners[i]();
        }
    }

    function initialize () {
        getMe();
    }

    // Use this function to execute callbacks when getMe has been done (window.user has been set)
    window.onInitialized = function (callback) {
        if (isInitialized) {
            return callback();
        }

        listeners.push(callback);
    }

    initialize();
})();