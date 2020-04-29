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

async function createCustomer(customer: CreateCustomerRequest) {
    const response = await client.post<Customer>('/customers', customer);
    return response.data;
}

function updateCustomer(uuid: string, customer: UpdateCustomerRequest) {
    return client.put<void>(`/customers/${uuid}`, customer);
}

function deleteCustomer(uuid: string) {
    return client.delete<void>(`/customers/${uuid}`);
}

export const customerAPI = {
    create: createCustomer,
    update: updateCustomer,
    delete: deleteCustomer,
};
