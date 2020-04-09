import axios from 'axios';

import { BACKEND_URL } from '../config/constants';

const client = axios.create({ baseURL: `${BACKEND_URL}/v1`});

export async function getAuthInstance() {
    const response = await client.get(`/login`);
    return response.data;
};

export async function login(auth) {
    const response = await client.get(`/login`, {
        auth,
    });
    return response.data;
};

export async function logout() {
    const response = await client.get(`/login`, {
        headers: { 'request-logout': true },
        auth: {},
    });
    return response.data;
};