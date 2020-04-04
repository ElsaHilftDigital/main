import axios from 'axios';

import { BACKEND_URL } from '../config/constants';

const client = axios.create({ baseURL: `${BACKEND_URL}`});

export async function getCustomers() {
    const response = await client.get(`/api/v1/admin/customers`);
    return response.data;
}