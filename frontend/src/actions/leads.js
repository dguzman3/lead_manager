import axios from 'axios';
import { createMessage, returnErrors } from './messages';
import { tokenConfig } from './auth';

import { GET_LEADS, DELETE_LEAD, ADD_LEAD, GET_ERRORS } from './types';

export const getLeads = () => (dispatch, getState) => {
    axios.get('/api/leads/', tokenConfig(getState))
        .then(res => {
            dispatch({
                type: GET_LEADS,
                payload: res.data
            });
        }).catch(err => dispatch(
            returnErrors(err.response.data, err.response.status)));
}

export const deleteLead = (id) => (dispatch, getState) => {
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

    axios.delete(`/api/leads/${id}/`, config)
        .then(res => {
            dispatch(createMessage({ deleteLead: 'Lead Deleted'}));
            dispatch({
                type: DELETE_LEAD,
                payload: id
            });
        }).catch(err => console.log(err));
}

export const addLead = (lead) => (dispatch, getState) => {
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

    axios.post('/api/leads/', lead, config)
        .then(res => {
            dispatch(createMessage({ addLead: 'Lead Added'}));
            dispatch({
                type: ADD_LEAD,
                payload: res.data
            });
        }).catch(err => dispatch(
            returnErrors(err.response.data, err.response.status)));
}