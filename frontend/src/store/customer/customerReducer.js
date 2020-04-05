import * as actions from './customerActions';

export const initialState = {
    getAllCustomersRequestOngoing: false,
    customers: [],
    selectedCustomer: null,
};

export default function customerReducer(state = initialState, action) {
    const { type, payload } = action;

    switch(type) {
        case actions.GET_ALL_CUSTOMERS:
            return {
                ...state,
                getAllCustomersRequestOngoing: true,
            };
        case actions.GET_ALL_CUSTOMERS_SUCCESS:
            return {
                ...state,
                getAllCustomersRequestOngoing: false,
                customers: payload,
                selectedCustomer: payload.length ? payload[0] : null,
            };
        case actions.SET_SELECTED_CUSTOMER:
            const selectedCustomers = state.customers.filter(customer => customer.uuid === payload);
            return {
                ...state,
                selectedCustomer: selectedCustomers.length ? selectedCustomers[0] : null,
            };
        default:
            return state;
    }
};