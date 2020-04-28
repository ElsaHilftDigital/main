import * as actions from './customerActions';

export const initialState = {
    customers: [],
    getCustomersRequestOngoing: false,
    getCustomersError: null,

    currentCustomer: null,
    getCustomerRequestOngoing: false,
    getCustomerError: null,

    createCustomerRequestOngoing: false,
    createCustomerSuccess: null,
    createCustomerError: null,

    updateCustomerRequestOngoing: false,
    updateCustomerError: null,

    deleteCustomerRequestOngoing: false,
    deleteCustomerError: null,

    selectedCustomer: null,
};

export default function customerReducer(state = initialState, action) {
    const { type, payload } = action;

    switch(type) {
        // get customers
        case actions.GET_CUSTOMERS:
            return {
                ...state,
                getCustomersError: null,
                getCustomersRequestOngoing: true,
            };
        case actions.GET_CUSTOMERS_SUCCESS:
            return {
                ...state,
                customers: payload,
                getCustomersRequestOngoing: false,
            };
        case actions.GET_CUSTOMERS_ERROR:
            return {
                ...state,
                getCustomersError: payload,
                getCustomersRequestOngoing: false,
            }
        // get customer
        case actions.GET_CUSTOMER:
            return {
                ...state,
                currentCustomer: undefined,
                getCustomerError: null,
                getCustomerRequestOngoing: true,
            };
        case actions.GET_CUSTOMER_SUCCESS:
            return {
                ...state,
                currentCustomer: payload,
                getCustomerRequestOngoing: false,
            };
        case actions.GET_CUSTOMER_ERROR:
            return {
                ...state,
                getCustomerError: payload,
                getCustomerRequestOngoing: false,
            };
        // create customer
        case actions.CREATE_CUSTOMER:
            return {
                ...state,
                createCustomerSuccess: null,
                createCustomerError: null,
                createCustomerRequestOngoing: true,
            };  
        case actions.CREATE_CUSTOMER_SUCCESS:
            return {
                ...state,
                createCustomerSuccess: payload,
                createCustomerRequestOngoing: false,
            };
        case actions.CREATE_CUSTOMER_ERROR:
            return {
                ...state,
                createCustomerError: payload,
                createCustomerRequestOngoing: false,
            };
        // update customer
        case actions.UPDATE_CUSTOMER:
            return {
                ...state,
                updateCustomerError: null,
                updateCustomerRequestOngoing: true,
            };
        case actions.UPDATE_CUSTOMER_SUCCESS:
            return {
                ...state,
                updateCustomerRequestOngoing: false,
            };
        case actions.UPDATE_CUSTOMER_ERROR:
            return {
                ...state,
                updateCustomerError: payload,
                updateCustomerRequestOngoing: false,
            }
        // delete customer
        case actions.DELETE_CUSTOMER:
            return {
                ...state,
                deleteCustomerError: null,
                deleteCustomerRequestOngoing: true,
            };
        case actions.DELETE_CUSTOMER_SUCCESS: 
            return {
                ...state,
                deleteCustomerRequestOngoing: false,
            };
        case actions.DELETE_CUSTOMER_ERROR:
            return {
                ...state,
                deleteCustomerError: payload,
                deleteCustomerRequestOngoing: false,
            };
        // default
        default:
            return state;
    }
};