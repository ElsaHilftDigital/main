import axios from 'axios';

import { BACKEND_URL } from '../config/constants';

const client = axios.create({ baseURL: `${BACKEND_URL}/v1/admin`});

export async function getModerators() {
    const response = await client.get(`/moderators`);
    return response.data;
};
