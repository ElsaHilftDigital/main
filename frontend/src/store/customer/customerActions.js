export const GET_ALL_CUSTOMERS = 'GET_ALL_CUSTOMERS';
export const GET_ALL_CUSTOMERS_SUCCESS = 'GET_ALL_CUSTOMERS_SUCCESS';

export const getAllCustomers = () => ({
    type: GET_ALL_CUSTOMERS,
});
export const getAllCustomersSuccess = customers => ({
    type: GET_ALL_CUSTOMERS_SUCCESS,
    payload: customers,
});