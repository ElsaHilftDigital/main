export const CREATE_PURCHASE = 'CREATE_PURCHASE';
export const CREATE_PURCHASE_SUCCESS = 'CREATE_PURCHASE_SUCCESS';
export const CREATE_PURCHASE_ERROR = 'CREATE_PURCHASE_ERROR';

export const createPurchase = purchase => ({
    type: CREATE_PURCHASE,
    payload: purchase,
});
export const createPurchaseSuccess = createdPurchase => ({
    type: CREATE_PURCHASE_SUCCESS,
    payload: createdPurchase,
});
export const createPurchaseError = error => ({
    type: CREATE_PURCHASE_ERROR,
    payload: error,
});