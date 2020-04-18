import axios from 'axios';

const client = axios.create({ baseURL: `/api/v1/admin`});

export async function getVolunteers() {
    const response = await client.get(`/volunteers`);
    return response.data;
}

export async function getVolunteer(uuid) {
    const response = await client.get(`volunteers/${uuid}`);
    return response.data;
}

export async function updateVolunteer(uuid, volunteer) {
    const response = await client.put(`/volunteers/${uuid}`, volunteer);
    return response.data;
}

export async function deleteVolunteer(uuid) {
    const response = await client.delete(`/volunteers/${uuid}`);
    return response.data;
}

export async function validateVolunteer(uuid) {
    const response = await client.post(`/volunteers/${uuid}/validate`);
    return response.data;
}

export async function getCompletedPurchaseList(uuid) {
    const response = await client.get(`/volunteers/${uuid}/completed-purchases`);
    return response.data;
}

export async function getOpenPurchaseList(uuid) {
    const response = await client.get(`/volunteers/${uuid}/open-purchases`);
    return response.data;
}
