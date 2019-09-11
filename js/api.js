window.TOKEN_NAMESPACE = 'token';
window.API_URL = 'http://localhost:8100/api/';

(function () {
    window.fetchAPI = function fetchAPI (urlSegment, opts) {
        const url = window.API_URL + urlSegment;
        const token = localStorage.getItem(window.TOKEN_NAMESPACE);

        const options = opts || {};

        options.headers = options.headers || {};

        const hasFormData = opts && opts.body && opts.body instanceof FormData;
        
        if (!hasFormData) {
            options.headers['Content-Type'] = 'application/json';

            if (options.body) {
                options.body = JSON.stringify(options.body);
            }
        }

        if (token) {
            options.headers['x-token'] = token;
        }

        return fetch(url, options)
            .then(res => res.json());
    };
})();