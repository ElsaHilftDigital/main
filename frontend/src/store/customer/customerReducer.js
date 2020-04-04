import * as actions from './customerActions';

export const initialState = {
    getAllCustomersRequestOngoing: false,
    customers: [],
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
            };
        default:
            return state;
    }
};