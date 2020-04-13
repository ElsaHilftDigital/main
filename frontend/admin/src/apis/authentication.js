import axios from 'axios';

import { BACKEND_URL } from '../config/constants';

const client = axios.create({ baseURL: `${BACKEND_URL}/v1`});

export async function login(auth) {
    const response = await client.post(`/login`, auth);
    return response.data;
};