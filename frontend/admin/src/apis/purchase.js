import axios from 'axios';

const client = axios.create({baseURL: `/api/v1/admin`});

export async function getPurchases() {
    const response = await client.get(`/purchases`);
    return response.data;
}

export async function getPurchase(uuid) {
    const response = await client.get(`/purchases/${uuid}`);
    return response.data;
}

export async function getPurchaseReceipt(uuid) {
    const response = await client.get(`/purchases/${uuid}/receipt`);
    return response.data;
}

export async function getPurchaseExport(uuid) {
    const response = await client.get(`/purchases/${uuid}/export`, {responseType: 'blob'});
    return response.data;
}

export async function createPurchase(purchase) {
    const response = await client.post(`/purchases`, purchase);
    return response.data;
}

export async function updatePurchase(uuid, update) {
    const response = await client.post(`/purchases/${uuid}`, update);
    return response.data;
}

export async function getAvailableVolunteers(uuid) {
    const response = await client.get(`/purchases/${uuid}/availablevolunteers`);
    return response.data;
}

export async function assignVolunteer(purchaseUuid, volunteerUuid) {
    const response = await client.post(`/purchases/${purchaseUuid}/assign-volunteer/${volunteerUuid}`);
    return response.data;
}

export async function customerNotified(uuid) {
    const response = await client.post(`/purchases/${uuid}/customernotified`)
    return response.data;
}

export async function publishPurchase(uuid) {
    await client.post(`/purchases/${uuid}/publish`);
    const response = await client.get(`/purchases/${uuid}`);
    return response.data;
}

export async function markCompleted(uuid) {
    const response = await client.post(`/purchases/${uuid}/markcompleted`);
    return response.data;
}
