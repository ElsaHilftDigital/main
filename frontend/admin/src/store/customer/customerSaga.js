import {all, call, put, takeEvery} from 'redux-saga/effects';

import {handleErrorRedirect, parseError} from '../../config/utils';
import * as actions from './customerActions';


export function* handleUpdateCustomer(updateCustomer, action) {
    try {
        const {uuid, customer} = action.payload;
        yield call(updateCustomer, uuid, customer);
        yield put(actions.updateCustomerSuccess());
    } catch (error) {
        console.log(error);
        handleErrorRedirect(error);
        yield put(actions.updateCustomerError(parseError(error)));
    }
};

export function* handleDeleteCustomer(deleteCustomer, action) {
    try {
        yield call(deleteCustomer, action.payload);
        yield put(actions.deleteCustomerSuccess());
    } catch (error) {
        console.log(error);
        handleErrorRedirect(error);
        yield put(actions.deleteCustomerError(parseError(error)));
    }
};


export function* customerSaga(customerApi) {
    yield all([
        takeEvery(actions.UPDATE_CUSTOMER, handleUpdateCustomer, customerApi.updateCustomer),
        takeEvery(actions.DELETE_CUSTOMER, handleDeleteCustomer, customerApi.deleteCustomer),
    ])
};