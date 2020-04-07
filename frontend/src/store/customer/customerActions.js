export const GET_CUSTOMERS = 'GET_CUSTOMERS';
export const GET_CUSTOMERS_SUCCESS = 'GET_CUSTOMERS_SUCCESS';
export const GET_CUSTOMERS_ERROR = 'GET_CUSTOMERS_ERROR';

export const GET_CUSTOMER = 'GET_CUSTOMER';
export const GET_CUSTOMER_SUCCESS = 'GET_CUSTOMER_SUCCESS';
export const GET_CUSTOMER_ERROR = 'GET_CUSTOMER_ERROR';

export const GET_COMPLETED_PURCHASE_LIST = 'GET_COMPLETED_PURCHASE_LIST';
export const GET_COMPLETED_PURCHASE_LIST_SUCCESS = 'GET_COMPLETED_PURCHASE_LIST_SUCCESS';
export const GET_COMPLETED_PURCHASE_LIST_ERROR = 'GET_COMPLETED_PURCHASE_LIST_ERROR';

export const GET_OPEN_PURCHASE_LIST = 'GET_OPEN_PURCHASE_LIST';
export const GET_OPEN_PURCHASE_LIST_SUCCESS = 'GET_OPEN_PURCHASE_LIST_SUCCESS';
export const GET_OPEN_PURCHASE_LIST_ERROR = 'GET_OPEN_PURCHASE_LIST_ERROR';

export const CREATE_CUSTOMER = 'CREATE_CUSTOMER';
export const CREATE_CUSTOMER_SUCCESS = 'CREATE_CUSTOMER_SUCCESS';
export const CREATE_CUSTOMER_ERROR = 'CREATE_CUSTOMER_ERROR';

export const UPDATE_CUSTOMER = 'UPDATE_CUSTOMER';
export const UPDATE_CUSTOMER_SUCCESS = 'UPDATE_CUSTOMER_SUCCESS';
export const UPDATE_CUSTOMER_ERROR = 'UPDATE_CUSTOMER_ERROR';

export const DELETE_CUSTOMER = 'DELETE_CUSTOMER';
export const DELETE_CUSTOMER_SUCCESS = 'DELETE_CUSTOMER_SUCCESS';
export const DELETE_CUSTOMER_ERROR = 'DELETE_CUSTOMER_ERROR';

export const SET_SELECTED_CUSTOMER = 'SET_SELECTED_CUSTOMER';


export const getCustomers = () => ({
    type: GET_CUSTOMERS,
});
export const getCustomersSuccess = customers => ({
    type: GET_CUSTOMERS_SUCCESS,
    payload: customers,
});
export const getCustomersError = error => ({
    type: GET_CUSTOMERS_ERROR,
    payload: error,
    error: true,
});

export const getCustomer = uuid => ({
    type: GET_CUSTOMER,
    payload: uuid,
});
export const getCustomerSuccess = customer => ({
    type: GET_CUSTOMER_SUCCESS,
    payload: customer,
});
export const getCustomerError = error => ({
    type: GET_CUSTOMER_ERROR,
    payload: error,
    error: true,
});

export const getCompletedPurchaseList = uuid => ({
    type: GET_COMPLETED_PURCHASE_LIST,
    payload: uuid,
});
export const getCompletedPurchaseListSuccess = completedPurchaseList => ({
    type: GET_COMPLETED_PURCHASE_LIST_SUCCESS,
    payload: completedPurchaseList,
});
export const getCompletedPurchaseListError = error => ({
    type: GET_COMPLETED_PURCHASE_LIST_ERROR,
    payload: error,
    error: true,
});

export const getOpenPurchaseList = uuid => ({
    type: GET_OPEN_PURCHASE_LIST,
    payload: uuid,
});
export const getOpenPurchaseListSuccess = openPurchaseList => ({
    type: GET_OPEN_PURCHASE_LIST_SUCCESS,
    payload: openPurchaseList,
});
export const getOpenPurchaseListError = error => ({
    type: GET_OPEN_PURCHASE_LIST_ERROR,
    payload: error,
    error: true,
});


export const createCustomer = customer => ({
    type: CREATE_CUSTOMER,
    payload: customer,
});
export const createCustomerSuccess = createdCustomer => ({
    type: CREATE_CUSTOMER_SUCCESS,
    payload: createdCustomer,
});
export const createCustomerError = error => ({
    type: CREATE_CUSTOMER_ERROR,
    payload: error,
    error: true,
});

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

export const setSelectedCustomer = uuid => ({
    type: SET_SELECTED_CUSTOMER,
    payload: uuid,
});