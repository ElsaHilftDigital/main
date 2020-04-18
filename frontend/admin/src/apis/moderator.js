import axios from 'axios';

const client = axios.create({ baseURL: `/api/v1/admin`});

export async function getModerators() {
    const response = await client.get(`/moderators`);
    return response.data;
}
