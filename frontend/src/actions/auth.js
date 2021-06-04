import axios from 'axios';
import { returnErrors } from './messages';
import { 
    USER_LOADED, 
    USER_LOADING, 
    AUTH_ERROR, 
    LOGIN_SUCCESS, 
    LOGIN_FAIL,
    LOGOUT_SUCCESS,
    REGISTER_FAIL,
    REGISTER_SUCCESS 
} from './types';

// Load User (potential error exists here)
export const loadUser = () => (dispatch, getState) => {
    // User Loading
    dispatch({ type: USER_LOADING });

    axios.get('/api/auth/user/', tokenConfig(getState))
        .then(res => {
            dispatch({
                type: USER_LOADED,
                payload: res.data
            });
        }).catch(err => {
            dispatch(returnErrors(err.response.data, err.response.status));
            dispatch({
                type: AUTH_ERROR,
            });
        });
}

// Login User (potential error exists here)
export const login = (username, password) => dispatch => {
    // Headers
    const config = {
        headers: {
            'Content-Type': 'application/json'
        },
    }

    // Request body
    const body = JSON.stringify({ username, password });

    axios.post('/api/auth/login/', body, config)
        .then(res => {
            dispatch({
                type: LOGIN_SUCCESS,
                payload: res.data
            });
        }).catch(err => {
            dispatch(returnErrors(err.response.data, err.response.status));
            dispatch({
                type: LOGIN_FAIL
            });
        });
}

// Register User
export const register = ({ username, password, email }) => dispatch => {
    // Headers
    const config = {
        headers: {
            'Content-Type': 'application/json'
        },
    }

    const password2 = password;

    // Request body
    const body = JSON.stringify({ username, email, password, password2 });

    axios.post('/api/auth/register/', body, config)
        .then(res => {
            dispatch({
                type: REGISTER_SUCCESS,
                payload: res.data
            });
        }).catch(err => {
            dispatch(returnErrors(err.response.data, err.response.status));
            dispatch({
                type: REGISTER_FAIL
            });
        });
}


// Logout User
export const logout = () => (dispatch, getState) => {
    // Get cookies for csrftoken
    function getCookie(name) {
        var cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            var cookies = document.cookie.split(';');
            for (var i = 0; i < cookies.length; i++) {
                var cookie = jQuery.trim(cookies[i]);
                if (cookie.substring(0, name.length + 1) === (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }

    var csrftoken = getCookie('csrftoken');

    // Get token from state
    const token = getState().auth.token;

    // Headers
    const config = {
        headers: {
            'X-CSRFToken': csrftoken,
            'Content-Type': 'application/json'
        }
    }

    // If token, add to headers config
    if (token) {
        config.headers['Authorization'] = `Token ${token}`;
    }

    axios.post('/api/auth/logout/', null, config)
        .then(res => {
            dispatch({
                type: LOGOUT_SUCCESS,
                payload: res.data
            });
        }).catch(err => {
            dispatch(returnErrors(err.response.data, err.response.status));
        });
}

export const tokenConfig = getState => {
    // Get token from state
    const token = getState().auth.token;

    // Headers
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    }

    // If token, add to headers config
    if (token) {
        config.headers['Authorization'] = `Token ${token}`;
    }
}

export const tokenConfigWithCSRF = getState => {
    // Get csrftoken from cookies
    var csrftoken = null;
    var name = 'csrftoken';
    if (document.cookie && document.cookie !== '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = jQuery.trim(cookies[i]);
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                csrftoken = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }

    // Get token from state
    const token = getState().auth.token;

    // Headers
    const config = {
        headers: {
            'X-CSRFToken': csrftoken,
            'Content-Type': 'application/json'
        }
    }

    // If token, add to headers config
    if (token) {
        config.headers['Authorization'] = `Token ${token}`;
    }
}
