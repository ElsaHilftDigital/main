export const GET_PURCHASES = 'GET_PURCHASES';
export const GET_PURCHASES_SUCCESS = 'GET_PURCHASES_SUCCESS';
export const GET_PURCHASES_ERROR = 'GET_PURCHASES_ERROR';

export const GET_PURCHASE = 'GET_PURCHASE';
export const GET_PURCHASE_SUCCESS = 'GET_PURCHASE_SUCCESS';
export const GET_PURCHASE_ERROR = 'GET_PURCHASE_ERROR';

export const GET_PURCHASE_RECEIPT = 'GET_RECEIPT_PURCHASE';
export const GET_PURCHASE_RECEIPT_SUCCESS = 'GET_PURCHASE_RECEIPT_SUCCESS';
export const GET_PURCHASE_RECEIPT_ERROR = 'GET_PURCHASE_RECEIPT_ERROR';

export const CREATE_PURCHASE = 'CREATE_PURCHASE';
export const CREATE_PURCHASE_SUCCESS = 'CREATE_PURCHASE_SUCCESS';
export const CREATE_PURCHASE_ERROR = 'CREATE_PURCHASE_ERROR';

export const UPDATE_PURCHASE = 'UPDATE_PURCHASE';
export const UPDATE_PURCHASE_SUCCESS = 'UPDATE_PURCHASE_SUCCESS';
export const UPDATE_PURCHASE_ERROR = 'UPDATE_PURCHASE_ERROR';

export const GET_AVAILABLE_VOLUNTEERS = 'GET_AVAILABLE_VOLUNTEERS';
export const GET_AVAILABLE_VOLUNTEERS_SUCCESS = 'GET_AVAILABLE_VOLUNTEERS_SUCCESS';
export const GET_AVAILABLE_VOLUNTEERS_ERROR = 'GET_AVAILABLE_VOLUNTEERS_ERROR';

export const ASSIGN_VOLUNTEER = 'ASSIGN_VOLUNTEER';
export const ASSIGN_VOLUNTEER_SUCCESS = 'ASSIGN_VOLUNTEER_SUCCESS';
export const ASSIGN_VOLUNTEER_ERROR = 'ASSIGN_VOLUNTEER_ERROR';

export const CUSTOMER_NOTIFIED = 'CUSTOMER_NOTIFIED';
export const CUSTOMER_NOTIFIED_SUCCESS = 'CUSTOMER_NOTIFIED_SUCCESS';
export const CUSTOMER_NOTIFIED_ERROR = 'CUSTOMER_NOTIFIED_ERROR';

export const PUBLISH_PURCHASE = 'PUBLISH_PURCHASE';
export const PUBLISH_PURCHASE_SUCCESS = 'PUBLISH_PURCHASE_SUCCESS';
export const PUBLISH_PURCHASE_ERROR = 'PUBLISH_PURCHASE_ERROR';

export const MARK_COMPLETED = 'MARK_COMPLETED';
export const MARK_COMPLETED_SUCCESS = 'MARK_COMPLETED_SUCCESS';
export const MARK_COMPLETED_ERROR = 'MARK_COMPLETED_ERROR';


export const getPurchases = () => ({
    type: GET_PURCHASES,
});
export const getPurchasesSuccess = purchases => ({
    type: GET_PURCHASES_SUCCESS,
    payload: purchases,
});
export const getPurchasesError = error => ({
    type: GET_PURCHASES_ERROR,
    payload: error,
    error: true,
});

export const getPurchase = uuid => ({
    type: GET_PURCHASE,
    payload: uuid,
});
export const getPurchaseSuccess = purchase => ({
    type: GET_PURCHASE_SUCCESS,
    payload: purchase,
});
export const getPurchaseError = error => ({
    type: GET_PURCHASE_ERROR,
    payload: error,
    error: true,
});

export const getPurchaseReceipt = uuid => ({
    type: GET_PURCHASE_RECEIPT,
    payload: uuid,
});
export const getPurchaseReceiptSuccess = receipt => ({
    type: GET_PURCHASE_RECEIPT_SUCCESS,
    payload: receipt,
});
export const getPurchaseReceiptError = error => ({
    type: GET_PURCHASE_RECEIPT_ERROR,
    payload: error,
    error: true,
});

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
    error: true,
});

export const update = (uuid, purchase) => ({
    type: UPDATE_PURCHASE,
    payload: {uuid, purchase},
});
export const updateSuccess = () => ({
    type: UPDATE_PURCHASE_SUCCESS,
});
export const updateError = error => ({
    type: UPDATE_PURCHASE_ERROR,
    payload: error,
    error: true,
});

export const getAvailableVolunteers = uuid => ({
    type: GET_AVAILABLE_VOLUNTEERS,
    payload: uuid,
});
export const getAvailableVolunteersSuccess = availableVolunteers => ({
    type: GET_AVAILABLE_VOLUNTEERS_SUCCESS,
    payload: availableVolunteers,
});
export const getAvailableVolunteersError = error => ({
    type: GET_AVAILABLE_VOLUNTEERS_ERROR,
    payload: error,
    error: true,
});

export const assignVolunteer = (purchaseUuid, volunteerUuid) => ({
    type: ASSIGN_VOLUNTEER,
    payload: { purchaseUuid, volunteerUuid },
});
export const assignVolunteerSuccess = () => ({
    type: ASSIGN_VOLUNTEER_SUCCESS,
});
export const assignVolunteerError = error => ({
    type: ASSIGN_VOLUNTEER_ERROR,
    payload: error,
    error: true,
});

export const customerNotified = uuid => ({
    type: CUSTOMER_NOTIFIED,
    payload: uuid,
});
export const customerNotifiedSuccess = () => ({
    type: CUSTOMER_NOTIFIED_SUCCESS,
})
export const customerNotifiedError = error => ({
    type: CUSTOMER_NOTIFIED_ERROR,
    payload: error,
    error: true,
});

export const publishPurchase = uuid => ({
    type: PUBLISH_PURCHASE,
    payload: uuid,
});
export const publishPurchaseSuccess = () => ({
    type: PUBLISH_PURCHASE_SUCCESS,
});
export const publishPurchaseError = error => ({
    type: PUBLISH_PURCHASE_ERROR,
    payload: error,
    error: true,
});

export const markCompleted = uuid => ({
    type: MARK_COMPLETED,
    payload: uuid,
});
export const markCompletedSuccess = () => ({
    type: MARK_COMPLETED_SUCCESS,
});
export const markCompletedError = error => ({
    type: MARK_COMPLETED_ERROR,
    payload: error,
    error: true
});
