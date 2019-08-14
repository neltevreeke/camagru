window.user = null;

(function () {
    let isInitialized = false;
    let listeners = [];

    const getMe = () => {
        // !!token === token ? token : false;
        const isLoggedIn = !!token;
    
        if (!isLoggedIn) {
            return;
        }

        return window.fetchAPI('user/get_me.php');
    }

    function triggerListeners () {
        for (let i = 0, l = listeners.length; i < l; i++) {
            listeners[i]();
        }
    }
    
    function initialize () {
        getMe()
            .then(res => {
                window.user = res
                isInitialized = true;
                triggerListeners();
            })
    }

    // Use this function to execute callbacks when getMe has been done (window.user has been set)
    window.onInitialized = function (callback) {
        if (isInitialized) {
            return callback();
        }

        listeners.push(callback)
    }
    
    initialize();
})();