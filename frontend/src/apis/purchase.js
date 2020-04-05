import axios from 'axios';

import { BACKEND_URL } from '../config/constants';

const client = axios.create({ baseURL: `${BACKEND_URL}`});

export async function createPurchase(purchase) {
    const response = await client.post(`/v1/admin/purchases`, purchase);
    return response.data;
}