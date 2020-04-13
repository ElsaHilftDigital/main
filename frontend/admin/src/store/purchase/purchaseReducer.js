import * as actions from './purchaseActions';

export const initialState = {
    purchases: [],
    getPurchasesRequestOngoing: false,
    getPurchasesError: null,

    currentPurchase: null,
    getPurchaseRequestOngoing: false,
    getPurchaseError: null,

    currentPurchaseReceipt: null,
    getPurchaseReceiptRequestOngoing: false,
    getPurchaseReceiptError: null,

    createPurchaseRequestOngoing: false,
    createPurchaseSuccess: null,
    createPurchaseError: null,

    updatePurchaseRequestOngoing: false,
    updatePurchaseError: null,

    assignVolunteerRequestOngoing: false,
    assignVolunteerError: null,

    customerNotifiedRequestOngoing: false,
    customerNotifierError: null,

    markCompletedRequestOngoing: false,
    markCompletedError: null,
};

export default function purchaseReducer(state = initialState, action) {
    const { type, payload } = action;

    switch(type) {
        // get purchases
        case actions.GET_PURCHASES: 
            return {
                ...state,
                getPurchasesError: null,
                getPurchasesRequestOngoing: true,
            };
        case actions.GET_PURCHASES_SUCCESS:
            return {
                ...state,
                purchases: payload,
                getPurchasesRequestOngoing: false,
            };
        case actions.GET_PURCHASES_ERROR:
            return {
                ...state,
                getPurchasesError: payload,
                getPurchasesRequestOngoing: false,
            };
        // get purchase
        case actions.GET_PURCHASE:
            return {
                ...state,
                getPurchaseError: null,
                getPurchaseRequestOngoing: true,
            };
        case actions.GET_PURCHASE_SUCCESS:
            return {
                ...state,
                currentPurchase: payload,
                getPurchaseRequestOngoing: false,
            };
        case actions.GET_PURCHASE_ERROR:
            return {
                ...state,
                getPurchaseError: payload,
                getPurchaseRequestOngoing: false,
            };
        // get purchase receipt
        case actions.GET_PURCHASE_RECEIPT:
            return {
                ...state,
                getPurchaseReceiptError: null,
                getPurchaseReceiptRequestOngoing: true,
            };
        case actions.GET_PURCHASE_RECEIPT_SUCCESS:
            return {
                ...state,
                currentPurchaseReceipt: payload,
                getPurchaseReceiptRequestOngoing: false,
            };
        case actions.GET_PURCHASE_RECEIPT_ERROR:
            return {
                ...state,
                getPurchaseReceiptError: payload,
                getPurchaseReceiptRequestOngoing: false,
            };
        // create purchase
        case actions.CREATE_PURCHASE:
            return {
                ...state,
                createPurchaseSuccess: null,
                createPurchaseError: null,
                createPurchaseRequestOngoing: true,
            };
        case actions.CREATE_PURCHASE_SUCCESS:
            return {
                ...state,
                createPurchaseSuccess: payload,
                createPurchaseRequestOngoing: false,
            };
        case actions.CREATE_PURCHASE_ERROR:
            return {
                ...state,
                createPurchaseError: payload,
                createPurchaseRequestOngoing: false,
            };
        // update
        case actions.UPDATE_PURCHASE:
            return {
                ...state,
                updatePurchaseRequestOngoing: true,
                updatePurchaseError: null,
            };
        case actions.UPDATE_PURCHASE_SUCCESS:
            return {
                ...state,
                updatePurchaseRequestOngoing: false,
            };
        case actions.UPDATE_PURCHASE_ERROR:
            return {
                ...state,
                updatePurchaseRequestOngoing: false,
                updatePurchaseError: payload,
            };
        // assign volunteer
        case actions.ASSIGN_VOLUNTEER:
            return {
                ...state,
                assignVolunteerError: null,
                assignVolunteerRequestOngoing: true,
            };
        case actions.ASSIGN_VOLUNTEER_SUCCESS:
            return {
                ...state,
                assignVolunteerRequestOngoing: false,
            };
        case actions.ASSIGN_VOLUNTEER_ERROR:
            return {
                ...state,
                assignVolunteerError: payload,
                assignVolunteerRequestOngoing: false,
            };
        // customer notified
        case actions.CUSTOMER_NOTIFIED:
            return {
                ...state,
                customerNotifierError: null,
                customerNotifiedRequestOngoing: true,
            };
        case actions.CUSTOMER_NOTIFIED_SUCCESS:
            return {
                ...state,
                customerNotifiedRequestOngoing: false,
            };
        case actions.CUSTOMER_NOTIFIED_ERROR:
            return {
                ...state,
                customerNotifierError: payload,
                customerNotifiedRequestOngoing: false,
            };
        // get purchase
        case actions.PUBLISH_PURCHASE:
            return {
                ...state,
                publishPurchaseError: null,
                publishPurchaseRequestOngoing: true,
            };
        case actions.PUBLISH_PURCHASE_SUCCESS:
            return {
                ...state,
                publishPurchaseRequestOngoing: false,
            };
        case actions.PUBLISH_PURCHASE_ERROR:
            return {
                ...state,
                publishPurchaseError: payload,
                publishPurchaseRequestOngoing: false,
            };
        // mark completed
        case actions.MARK_COMPLETED:
            return {
                ...state,
                markCompletedError: null,
                markCompletedRequestOngoing: true,
            };
        case actions.MARK_COMPLETED_SUCCESS: 
            return {
                ...state,
                markCompletedRequestOngoing: false,
            };
        case actions.MARK_COMPLETED_ERROR:
            return {
                ...state,
                markCompletedError: payload,
                markCompletedRequestOngoing: false,
            };
        // default
        default:
            return state;
    }
};