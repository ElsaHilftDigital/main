import { all, call, put, takeEvery, takeLatest } from 'redux-saga/effects';

import { handleErrorRedirect, parseError } from '../../config/utils';
import * as actions from './purchaseActions';


export function* handleGetPurchases(getPurchases) {
    try {
        const purchases = yield call(getPurchases);
        yield put(actions.getPurchasesSuccess(purchases));
    } catch (error) {
        console.log(error);
        handleErrorRedirect(error);
        yield put(actions.getPurchasesError(parseError(error)));
    }
};

export function* handleGetPurchase(getPurchase, action) {
    try {
        const purchase = yield call(getPurchase, action.payload);
        yield put(actions.getPurchaseSuccess(purchase));
    } catch (error) {
        console.log(error);
        handleErrorRedirect(error);
        yield put(actions.getPurchaseError(parseError(error)));
    }
}

export function* handleGetPurchaseReceipt(getPurchaseReceipt, action) {
    try {
        const receipt = yield call(getPurchaseReceipt, action.payload);
        yield put(actions.getPurchaseReceiptSuccess(receipt));
    } catch (error) {
        console.log(error);
        handleErrorRedirect(error);
        yield put(actions.getPurchaseReceiptError(parseError(error)));
    }
}

export function* handleCreatePurchase(createPurchase, action) {
    try {
        const createdPurchase = yield call(createPurchase, action.payload);
        yield put(actions.createPurchaseSuccess(createdPurchase));
    } catch (error) {
        console.log(error);
        handleErrorRedirect(error);
        yield put(actions.createPurchaseError(parseError(error)));
    }
}

export function* handleUpdatePurchase(updatePurchase, action) {
    try {
        const { uuid, purchase } = action.payload;
        yield call(updatePurchase, uuid, purchase);
        yield put(actions.updateSuccess());
    } catch (error) {
        console.log(error);
        handleErrorRedirect(error);
        yield put(actions.updateError(parseError(error)));
    }
}

export function* handleAssignVolunteer(assignVolunteer, action) {
    try {
        const { purchaseUuid, volunteerUuid } = action.payload;
        yield call(assignVolunteer, purchaseUuid, volunteerUuid);
        yield put(actions.assignVolunteerSuccess());
    } catch (error) {
        console.log(error);
        handleErrorRedirect(error);
        yield put(actions.assignVolunteerError(parseError(error)));
    }
};

export function* handleCustomerNotified(customerNotified, action) {
    try {
        yield call(customerNotified, action.payload);
        yield put(actions.customerNotifiedSuccess());
    } catch (error) {
        console.log(error);
        handleErrorRedirect(error);
        yield put(actions.customerNotifiedError(parseError(error)));
    }
}

export function* handlePublishPurchase(publishPurchase, action) {
    try {
        const purchase = yield call(publishPurchase, action.payload);
        yield put(actions.publishPurchaseSuccess());
        yield put(actions.getPurchaseSuccess(purchase));
    } catch (error) {
        console.log(error);
        handleErrorRedirect(error);
        yield put(actions.publishPurchaseError(parseError(error)));
    }
};

export function* handleMarkCompleted(markCompleted, action) {
    try {
        yield call(markCompleted, action.payload);
        yield put(actions.markCompletedSuccess());
    } catch (error) {
        console.log(error);
        handleErrorRedirect(error);
        yield put(actions.customerNotifiedError(parseError(error)));
    }
}


export function* purchaseSaga(purchaseApi) {
    yield all([
        takeLatest(actions.GET_PURCHASES, handleGetPurchases, purchaseApi.getPurchases),
        takeLatest(actions.GET_PURCHASE, handleGetPurchase, purchaseApi.getPurchase),
        takeLatest(actions.GET_PURCHASE_RECEIPT, handleGetPurchaseReceipt, purchaseApi.getPurchaseReceipt),
        takeEvery(actions.CREATE_PURCHASE, handleCreatePurchase, purchaseApi.createPurchase),
        takeEvery(actions.ASSIGN_VOLUNTEER, handleAssignVolunteer, purchaseApi.assignVolunteer),
        takeEvery(actions.CUSTOMER_NOTIFIED, handleCustomerNotified, purchaseApi.customerNotified),
        takeEvery(actions.PUBLISH_PURCHASE, handlePublishPurchase, purchaseApi.publishPurchase),
        takeEvery(actions.MARK_COMPLETED, handleMarkCompleted, purchaseApi.markCompleted),
        takeEvery(actions.UPDATE_PURCHASE, handleUpdatePurchase, purchaseApi.updatePurchase),
    ])
};
