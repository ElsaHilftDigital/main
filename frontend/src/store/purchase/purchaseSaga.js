import { all, call, put, takeEvery, takeLatest } from 'redux-saga/effects';

import { handleErrorRedirect, parseError } from '../../config/utils';
import * as actions from './purchaseActions';


export function* handleGetPurchases(purchaseApi) {
    try {
        const purchases = yield call([purchaseApi, getPurchases]);
        yield put(actions.getPurchasesSuccess(purchases));
    } catch (error) {
        console.log(error);
        handleErrorRedirect(error);
        yield put(actions.getPurchasesError(parseError(error)));
    }
};

export function* handleGetPurchase(purchaseApi, action) {
    try {
        const purchase = yield call([purchaseApi, getPurchase], action.payload);
        yield put(actions.getPurchaseSuccess(purchase));
    } catch (error) {
        console.log(error);
        handleErrorRedirect(error);
        yield put(actions.getPurchaseError(parseError(error)));
    }
}

export function* handleCreatePurchase(purchaseApi, action) {
    try {
        const createdPurchase = yield call([purchaseApi, createPurchase], action.payload);
        yield put(actions.createPurchaseSuccess(createdPurchase));
    } catch (error) {
        console.log(error);
        handleErrorRedirect(error);
        yield put(actions.createPurchaseError(parseError(error)));
    }
}

export function* handleAssignVolunteer(purchaseApi, action) {
    try {
        const { purchaseUuid, volunteerUuid } = action.payload;
        yield call([purchaseApi, assignVolunteer], purchaseUuid, volunteerUuid);
        yield put(actions.assignVolunteerSuccess());
    } catch (error) {
        console.log(error);
        handleErrorRedirect(error);
        yield put(actions.assignVolunteerError(parseError(error)));
    }
};

export function* handleCustomerNotified(purhcaseApi, action) {
    try {
        yield call([purhcaseApi, customerNotified], action.payload);
        yield put(actions.customerNotifiedSuccess());
    } catch (error) {
        console.log(error);
        handleErrorRedirect(error);
        yield put(actions.customerNotifiedError(parseError(error)));
    }
}

export function* handleMarkCompleted(purchaseApi, action) {
    try {
        yield call([purchaseApi, markCompleted], action.payload);
        yield put(actions.markCompletedSuccess());
    } catch (error) {
        console.log(error);
        handleErrorRedirect(error);
        yield put(actions.customerNotifiedError(parseError(error)));
    }
}


export function* purchaseSaga(purchaseApi) {
    yield all([
        takeLatest(actions.GET_PURCHASES, handleGetPurchases, purchaseApi),
        takeLatest(actions.GET_PURCHASE, handleGetPurchase, purhcaseApi),
        takeEvery(actions.CREATE_PURCHASE, handleCreatePurchase, purchaseApi),
        takeEvery(actions.ASSIGN_VOLUNTEER, handleAssignVolunteer, purchaseApi),
        takeEvery(actions.CUSTOMER_NOTIFIED, handleCustomerNotified, purchaseApi),
        takeEvery(actions.MARK_COMPLETED, handleMarkCompleted, purchaseApi),
    ])
};
