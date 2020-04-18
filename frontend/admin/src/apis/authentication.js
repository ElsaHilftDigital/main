import axios from 'axios';

const client = axios.create({ baseURL: `/api/v1`});

export async function login(auth) {
    const response = await client.post(`/login`, auth);
    return response.data;
}