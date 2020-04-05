import { all, call, put, takeEvery, takeLatest } from 'redux-saga/effects';

import history from '../../history';
import * as actions from './purchaseActions';
import { handleGetAllCustomers } from '../customer/customerSaga';

export function* handleCreatePurchase(createPurchase, action) {
    try {
        const createdPurchase = yield call(createPurchase, action.payload);
        yield put(actions.createPurchaseSuccess(createdPurchase));
    } catch (error) {
        console.log(error);
        if (error.response && error.response.data) {
            yield put(actions.createPurchaseError(error.response.data));
        } else {
            yield put(actions.createPurchaseError(error));
        }
        if (error.response && error.response.status === 401) {
            // redirect to admin login
            history.push('/admin');
        }
    }
}

export function* handleGetAllPurchases(getPurchases) {
    try {
        const purchases = yield call(getPurchases);
        yield put(actions.getAllPurchasesSuccess(purchases));
    } catch (error) {
        console.log(error);
        if (error.response && error.response.status === 401) {
            // redirect to admin login
            history.push('/admin');
        }
    }
}

export function* handleAssignVolunteer(assignVolunteer) {
    try {
        const uuids = yield call(assignVolunteer);
        yield put(actions.assignVolunteer(uuids[0], uuids[1]));
    } catch (error) {
        console.log(error);
        if (error.response && error.response.status === 401) {
            // redirect to admin login
            history.push('/admin');
        }
    }
}

export function* purchaseSaga(purchaseApi) {
    yield all([
        takeLatest(actions.GET_ALL_PURCHASES, handleGetAllPurchases, purchaseApi.getPurchases),
        takeEvery(actions.CREATE_PURCHASE, handleCreatePurchase, purchaseApi.createPurchase),
        takeLatest(actions.ASSIGN_VOLUNTEER, handleAssignVolunteer, purchaseApi.assignVolunteer),
    ])
}