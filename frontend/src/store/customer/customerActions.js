export const GET_ALL_CUSTOMERS = 'GET_ALL_CUSTOMERS';
export const GET_ALL_CUSTOMERS_SUCCESS = 'GET_ALL_CUSTOMERS_SUCCESS';
export const SET_SELECTED_CUSTOMER = 'SET_SELECTED_CUSTOMER';

export const CREATE_CUSTOMER = 'CREATE_CUSTOMER';
export const CREATE_CUSTOMER_SUCCESS = 'CREATE_CUSTOMER_SUCCESS';
export const CREATE_CUSTOMER_ERROR = 'CREATE_CUSTOMER_ERROR';

export const getAllCustomers = () => ({
    type: GET_ALL_CUSTOMERS,
});
export const getAllCustomersSuccess = customers => ({
    type: GET_ALL_CUSTOMERS_SUCCESS,
    payload: customers,
});

export const setSelectedCustomer = (uuid) => ({
    type: SET_SELECTED_CUSTOMER,
    payload: uuid,
});

export const createCustomer = (customer) => ({
    type: CREATE_CUSTOMER,
    payload: customer,
});
export const createCustomerSuccess = () => ({
    type: CREATE_CUSTOMER_SUCCESS,
});
export const createCustomerError = error => ({
    type: CREATE_CUSTOMER_ERROR,
});