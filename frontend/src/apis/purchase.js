import axios from 'axios';

import { BACKEND_URL } from '../config/constants';

const client = axios.create({ baseURL: `${BACKEND_URL}`});

export async function createPurchase(purchase) {
    const response = await client.post(`/v1/admin/purchases`, purchase);
    return response.data;
}

export async function getPurchases() {
    const response = await client.get(`/v1/admin/purchases`);
    return response.data;
}

export async function assignVolunteer(purchase, volunteer) {
    const response = await client.post(`/v1/admin/purchases/${purchase}/assign/${volunteer}`)
    return response.data;
}

export async function notifyVolunteerToDeliver(uuid) {
    const response = await client.post(`/v1/admin/purchases/${uuid}/customernotified`)
    return response.data;
}
