import * as actions from './purchaseActions';

export const initialState = {
    createPurchaseRequestOngoing: false,
    createPurchaseSuccess: null,
    createPurchaseError: null,
};

export default function purchaseReducer(state = initialState, action) {
    const { type, payload } = action;

    switch(type) {
        case actions.CREATE_PURCHASE:
            return {
                ...state,
                createPurchaseRequestOngoing: true,
                createPurchaseSuccess: null,
                createPurchaseError: null,
            };  
        case actions.CREATE_PURCHASE_SUCCESS:
            return {
                ...state,
                createPurchaseRequestOngoing: false,
                createPurchaseSuccess: true,
                createPurchaseError: null,
            };
        case actions.CREATE_PURCHASE_ERROR:
            return {
                ...state,
                createPurchaseRequestOngoing: false,
                createPurchaseSuccess: false,
                createPurchaseError: payload,
            };
        default:
            return state;
    }
};