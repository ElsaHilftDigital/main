import axios from 'axios';

import { BACKEND_URL } from '../config/constants';

const client = axios.create({ baseURL: `${BACKEND_URL}`});

export async function getAuthInstance() {
    const response = await client.get(`/v1/login`);
    return response.data;
}

export async function login(auth) {
    const response = await client.get(`/v1/login`, {
        auth,
    });
    return response.data;
}

export async function logout() {
    await client.get(`/v1/login`, {
        headers: { 'request-logout': true },
        auth: {},
    });
}