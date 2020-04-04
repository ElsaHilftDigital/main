import axios from 'axios';

import { BACKEND_URL } from '../config/constants';

const authInstance = { username: null, anonymous: true };

export async function getAuthInstance() {
    //const response = await axios.get(`${BACKEND_URL}/v1/auth`);
    //return response.data;
    return authInstance;
}

export async function login(auth) {
    //const response = await axios.get(`${BACKEND_URL}/v1/auth/login`, auth);
    //return response.data;
    authInstance.username = 'test';
    authInstance.anonymous = false;
    return '';
}

export async function logout() {
    //const response = await axios.get(`${BACKEND_URL}/v1/auth/logout`);
    //return response.data;
    authInstance.username = null;
    authInstance.anonymous = true;
    return ''
}