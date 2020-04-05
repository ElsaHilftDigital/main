import * as actions from './purchaseActions';

export const initialState = {
    createPurchaseRequestOngoing: false,
    createPurchaseSuccess: null,
    createPurchaseError: null,
    purchases: [],
    getAllPurchasesRequestOngoing: false,
};

export default function purchaseReducer(state = initialState, action) {
    const { type, payload } = action;

    switch(type) {
        case actions.GET_ALL_PURCHASES:
            return {
                ...state,
                getAllPurchasesRequestOngoing: true,
            };
        case actions.GET_ALL_PURCHASES_SUCCESS:
            return {
                ...state,
                getAllPurchasesRequestOngoing: false,
                purchases: payload,
            };
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
                createPurchaseSuccess: payload,
                createPurchaseError: null,
            };
        case actions.CREATE_PURCHASE_ERROR:
            return {
                ...state,
                createPurchaseRequestOngoing: false,
                createPurchaseSuccess: null,
                createPurchaseError: payload,
            };
        default:
            return state;
    }
};