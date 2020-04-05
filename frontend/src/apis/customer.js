import axios from 'axios';

import { BACKEND_URL } from '../config/constants';

const client = axios.create({ baseURL: `${BACKEND_URL}`});

export async function getCustomers() {
    const response = await client.get(`/v1/admin/customers`);
    return response.data;
}

export async function getCustomer(uuid) {
    const response = await client.get(`/v1/admin/customer/${uuid}`);
    return response.data;
}

export async function createCustomer(customer) {
    const response = await client.post('/v1/admin/customers', customer);
    return response.data;
}