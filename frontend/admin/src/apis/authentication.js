import axios from 'axios';

const client = axios.create({ baseURL: `/api/v1`});

export function login(auth) {
    return client.post(`/login`, auth);
}