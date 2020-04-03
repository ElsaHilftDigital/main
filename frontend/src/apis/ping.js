import axios from 'axios';

import { BACKEND_URL } from '../config/constants';

export async function ping() {
    //const response = await axios.get(`${BACKEND_URL}/api/v1/ping`);
    //return response.data;
    return 'Hello World!';
}