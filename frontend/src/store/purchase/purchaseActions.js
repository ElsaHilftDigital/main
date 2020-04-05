export const CREATE_PURCHASE = 'CREATE_PURCHASE';
export const CREATE_PURCHASE_SUCCESS = 'CREATE_PURCHASE_SUCCESS';
export const CREATE_PURCHASE_ERROR = 'CREATE_PURCHASE_ERROR';
export const GET_ALL_PURCHASES = 'GET_ALL_PURCHASES';
export const GET_ALL_PURCHASES_SUCCESS = 'GET_ALL_PURCHASES_SUCCESS';
export const ASSIGN_VOLUNTEER = 'ASSIGN_VOLUNTEER';

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
export const getAllPurchases = () => ({
    type: GET_ALL_PURCHASES,
});
export const getAllPurchasesSuccess = purchases => ({
    type: GET_ALL_PURCHASES_SUCCESS,
    payload: purchases,
});
export const assignVolunteer = (purchase, volunteer) => ({
    type: ASSIGN_VOLUNTEER,
    payload: [purchase, volunteer],
});