import axios from 'axios';

import { BACKEND_URL } from '../config/constants';

const adminClient = axios.create({ baseURL: `${BACKEND_URL}/v1/admin`});
const anonymousClient = axios.create({ baseURL: `${BACKEND_URL}/v1/anonymous`});

export async function getVolunteers() {
    const response = await adminClient.get(`/volunteers`);
    return response.data;
};

export async function getVolunteer(uuid) {
    const response = await adminClient.get(`volunteers/${uuid}`);
    return response.data;
};

export async function createVolunteer(volunteer) {
    const response = await anonymousClient.post(`/volunteers`, volunteer);
    return response.data;
};

export async function updateVolunteer(uuid, volunteer) {
    const response = await adminClient.put(`/volunteers/${uuid}`, volunteer);
    return response.data;
};

export async function deleteVolunteer(uuid) {
    const response = await adminClient.delete(`/volunteers/${uuid}`);
    return response;
};

export async function validateVolunteer(uuid) {
    const response = await adminClient.post(`/volunteers/${uuid}/validate`);
    return response.data;
};

export async function getCompletedPurchaseList(uuid) {
    const response = await adminClient.get(`/volunteers/${uuid}/completed-purchases`);
    return response.data;
};

export async function getOpenPurchaseList(uuid) {
    const response = await adminClient.get(`/volunteers/${uuid}/open-purchases`);
    return response.data;
};
