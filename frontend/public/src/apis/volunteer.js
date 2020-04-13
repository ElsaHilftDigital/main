import axios from 'axios';

import { BACKEND_URL } from '../config/constants';

const anonymousClient = axios.create({ baseURL: `${BACKEND_URL}/v1/anonymous`});


export async function createVolunteer(volunteer) {
    const response = await anonymousClient.post(`/volunteers`, volunteer);
    return response.data;
};
