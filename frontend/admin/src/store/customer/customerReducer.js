import * as actions from './customerActions';

export const initialState = {
    updateCustomerRequestOngoing: false,
    updateCustomerError: null,

    deleteCustomerRequestOngoing: false,
    deleteCustomerError: null,

    selectedCustomer: null,
};

export default function customerReducer(state = initialState, action) {
    const { type, payload } = action;

    switch(type) {
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