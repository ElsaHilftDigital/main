import axios from 'axios';

const client = axios.create({baseURL: `/api/v1/admin`});

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

export async function getCustomer(uuid: string) {
    const response = await client.get<Customer>(`/customers/${uuid}`);
    return response.data;
}

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
