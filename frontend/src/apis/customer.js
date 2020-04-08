import axios from 'axios';

import { BACKEND_URL } from '../config/constants';

const client = axios.create({ baseURL: `${BACKEND_URL}/v1/admin`});

export async function getCustomers() {
    const response = await client.get(`/customers`);
    return response.data;
};

export async function getCustomer(uuid) {
    const response = await client.get(`/customers/${uuid}`);
    return response.data;
};

export async function createCustomer(customer) {
    const response = await client.post('/customers', customer);
    return response.data;
};

export async function updateCustomer(uuid, customer) {
    const response = await client.put(`/customers/${uuid}`, customer);
    return response.data;
};

export async function deleteCustomer(uuid) {
    const response = await client.delete(`/customers/${uuid}`);
    return response.data;
};

export async function getCompletedPurchaseList(uuid) {
    const response = await client.get(`/customers/${uuid}/completed-purchases`);
    return response.data;
};

export async function getOpenPurchaseList(uuid) {
    const response = await client.get(`/customers/${uuid}/open-purchases`);
    return response.data;
};