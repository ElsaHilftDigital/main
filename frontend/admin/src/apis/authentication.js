import axios from 'axios';

const client = axios.create({ baseURL: `/api/v1/auth`});

export function login(auth) {
    return client.post(`/login`, auth);
}

export function changePassword(update) {
    return client.post(`/change-password`, update);
}