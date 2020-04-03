import axios from 'axios';

import { BACKEND_URL } from '../config/constants';

export async function getVolunteer(uuid) {
    const response = await axios.get(`${BACKEND_URL}/v1/volunteers/${uuid}`);
    return response.data;
}

export async function createVolunteer(volunteer) {
    const response = await axios.post(`${BACKEND_URL}/v1/volunteers`, volunteer);
    return response.data;
}

