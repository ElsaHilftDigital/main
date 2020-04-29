import axios from 'axios';
import { restClient } from 'config/utils';
import { useEffect, useState } from 'react';

const client = restClient('/api/v1/admin');

export interface Customer {
    uuid: string,
    firstName: string,
    lastName: string,
    phone: string,
    mobile?: string,
    address: string,
    zipCode?: string,
    city: string,
}


export interface CreateCustomerRequest {
    firstName: string,
    lastName: string,
    phone: string,
    mobile?: string,
    address: string,
    city: string,
    zipCode?: string,
}

export interface UpdateCustomerRequest {
    firstName: string,
    lastName: string,
    phone: string,
    mobile?: string,
    address: string,
    city: string,
    zipCode?: string,
}

export async function getCustomers() {
    const response = await client.get(`/customers`);
    return response.data;
}

export const useCustomers = () => {
    const [customers, setCustomers] = useState<Customer[]>([]);

    useEffect(() => {
        const source = axios.CancelToken.source();

        client.get<Customer[]>('/customers', {
            cancelToken: source.token,
        })
            .then(response => setCustomers(response.data))
            .catch();

        return () => {
            source.cancel();
        };
    }, []);

    return { customers };
};

export async function getCustomer(uuid: string) {
    const response = await client.get<Customer>(`/customers/${uuid}`);
    return response.data;
}

export const useCustomer = (uuid: string) => {
    const [customer, setCustomer] = useState<Customer>();
    const [dummy, setDummy] = useState({});
    const refresh = () => setDummy({});

    useEffect(() => {
        const source = axios.CancelToken.source();

        client.get<Customer>(`/customers/${uuid}`, {
            cancelToken: source.token,
        })
            .then(response => setCustomer(response.data))
            .catch();

        return () => {
            source.cancel();
        };
    }, [uuid, dummy]);

    return { customer, refresh };
};

export async function createCustomer(customer: CreateCustomerRequest) {
    const response = await client.post<Customer>('/customers', customer);
    return response.data;
}

export function updateCustomer(uuid: string, customer: UpdateCustomerRequest) {
    return client.put<void>(`/customers/${uuid}`, customer);
}

export function deleteCustomer(uuid: string) {
    return client.delete<void>(`/customers/${uuid}`);
}
