export const UPDATE_CUSTOMER = 'UPDATE_CUSTOMER';
export const UPDATE_CUSTOMER_SUCCESS = 'UPDATE_CUSTOMER_SUCCESS';
export const UPDATE_CUSTOMER_ERROR = 'UPDATE_CUSTOMER_ERROR';

export const DELETE_CUSTOMER = 'DELETE_CUSTOMER';
export const DELETE_CUSTOMER_SUCCESS = 'DELETE_CUSTOMER_SUCCESS';
export const DELETE_CUSTOMER_ERROR = 'DELETE_CUSTOMER_ERROR';

export const updateCustomer = (uuid, customer) => ({
    type: UPDATE_CUSTOMER,
    payload: { uuid, customer },
});
export const updateCustomerSuccess = () => ({
    type: UPDATE_CUSTOMER_SUCCESS,
});
export const updateCustomerError = error => ({
    type: UPDATE_CUSTOMER_ERROR,
    payload: error,
    error: true,
});

export const deleteCustomer = uuid => ({
    type: DELETE_CUSTOMER,
    payload: uuid,
});
export const deleteCustomerSuccess = () => ({
    type: DELETE_CUSTOMER_SUCCESS,
});
export const deleteCustomerError = error => ({
    type: DELETE_CUSTOMER_ERROR,
    payload: error,
    error: true,
});