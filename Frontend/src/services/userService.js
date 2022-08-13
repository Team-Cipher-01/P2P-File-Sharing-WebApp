import {config} from '../config';
export const userService = {
    login,
    logout,
    register,
}


async function login(username, password) {
    let response = {};
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    };

    if(!config.env === 'dev') {
    response = await fetch(`${config.apiUrl}/users/authenticate`, requestOptions)
        .then(handleResponse)
        .then(user => {
            // store user details and jwt token in local storage to keep user logged in between page refreshes
            localStorage.setItem('user', JSON.stringify(user));

            return { status: "ok", success: true, response: user}
        }).catch(error => {
            console.error("Error in Login Authenticate.", error);
            return { status: "error", success: false, response: error}
        });
    } else {
        let user = { "name": "Akshay", "mobile": "9834611452", "email": "abc@gfy.com" }
        localStorage.setItem('user', JSON.stringify(user));

        response = { status: "ok", success: true, response: user}
    }
    return response;
}

function logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('user');
}

function register(user) {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user)
    };

    return fetch(`${config.apiUrl}/users/register`, requestOptions).then(handleResponse);
}

function handleResponse(response) {
    return response.text().then(text => {
        const data = text && JSON.parse(text);
        if (!response.ok) {
            if (response.status === 401) {
                // auto logout if 401 response returned from api
                logout();
                window.location.reload(true);
            }

            const error = (data && data.message) || response.statusText;
            return Promise.reject(error);
        }

        return data;
    });
}