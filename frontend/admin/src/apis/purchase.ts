import axios from 'axios';
import { restClient } from '../config/utils';
import { useEffect, useState } from 'react';

const client = restClient('/api/v1/admin');

export interface Purchase {
    uuid: string,
    assignedVolunteer?: any,
    volunteerApplications: any[],
    supermarkets: any,
    status: string,
    paymentMethod: string,
    timing: string,
    size: string,
    publicComments: string,
    privateComments: string,
    internalComments: string,
    cost: number,
    expensesPaid: boolean,
    responsible: any,
    customer: any,
    createdBy: string,
    createdAt: any,
}

export interface CreatePurchaseRequest {
    supermarkets: any,
    paymentMethod: string,
    timing: string,
    purchaseSize: string,
    publicComments: string,
    privateComments: string,
    customer: string,
}

export interface UpdatePurchaseRequest {
    timing: string,
    publicComments: string,
    privateComments: string,
    internalComments: string,
    size: string,
    paymentMethod: string,
    cost: number,
    supermarkets: any,
    responsibleModerator: string,
}

export const usePurchases = () => {
    const [purchases, setPurchases] = useState<Purchase[]>([]);

    useEffect(() => {
        const source = axios.CancelToken.source();

        client.get<Purchase[]>('/purchases', {
            cancelToken: source.token,
        })
            .then(response => setPurchases(response.data))
            .catch();

        return () => {
            source.cancel();
        };
    }, []);

    return { purchases };
};

export const usePurchase = (uuid: string) => {
    const [purchase, setPurchase] = useState<Purchase>();
    const [dummy, setDummy] = useState({});
    const refresh = () => setDummy({});

    useEffect(() => {
        const source = axios.CancelToken.source();

        client.get<Purchase>(`/purchases/${uuid}`, {
            cancelToken: source.token,
        })
            .then(response => setPurchase(response.data))
            .catch();

        return () => {
            source.cancel();
        };
    }, [uuid, dummy]);

    return { purchase, refresh };
};

async function createPurchase(purchase: CreatePurchaseRequest) {
    const response = await client.post<string>(`/purchases`, purchase);
    return response.data;
}

function deletePurchase(uuid: string) {
    return client.delete<void>(`/purchases/${uuid}`);
}

function updatePurchase(uuid: string, update: UpdatePurchaseRequest) {
    return client.post<void>(`/purchases/${uuid}`, update);
}

function assignVolunteer(purchaseUuid: string, volunteerUuid: string) {
    return client.post<void>(`/purchases/${purchaseUuid}/assign-volunteer/${volunteerUuid}`);
}

function customerNotified(uuid: string, message: string) {
    return client.post<void>(`/purchases/${uuid}/customernotified`, message, {
        headers: { 'Content-Type': 'application/json' },
    });
}

function publishPurchase(uuid: string) {
    return client.post<void>(`/purchases/${uuid}/publish`);
}

function markCompleted(uuid: string) {
    return client.post<void>(`/purchases/${uuid}/markcompleted`);
}

export const purchaseAPI = {
    create: createPurchase,
    update: updatePurchase,
    delete: deletePurchase,
    assignVolunteer: assignVolunteer,
    notifyCustomer: customerNotified,
    publish: publishPurchase,
    markCompleted: markCompleted,
};