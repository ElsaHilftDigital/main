import { all, call, put, takeEvery } from 'redux-saga/effects';

import history from '../../history';
import * as actions from './purchaseActions';

export function* handleCreatePurchase(createPurchase, action) {
    try {
        yield call(createPurchase, action.payload);
        yield put(actions.createPurchaseSuccess());
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

export function* purchaseSaga(purchaseApi) {
    yield all([
        takeEvery(actions.CREATE_PURCHASE, handleCreatePurchase, purchaseApi.createPurchase),
    ])
}