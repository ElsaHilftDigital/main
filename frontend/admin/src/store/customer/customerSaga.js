import {all, call, put, takeLatest, takeEvery} from 'redux-saga/effects';

import {handleErrorRedirect, parseError} from '../../config/utils';
import * as actions from './customerActions';


export function* handleGetCustomers(getCustomers) {
    try {
        const customers = yield call(getCustomers);
        yield put(actions.getCustomersSuccess(customers));
    } catch (error) {
        console.log(error);
        handleErrorRedirect(error);
        yield put(actions.getCustomersError(parseError(error)));
    }
};

export function* handleGetCustomer(getCustomer, action) {
    try {
        const customer = yield call(getCustomer, action.payload);
        yield put(actions.getCustomerSuccess(customer));
    } catch (error) {
        console.log(error);
        handleErrorRedirect(error);
        yield put(actions.getCustomerError(parseError(error)));
    }
};

export function* handleCreateCustomer(createCustomer, action) {
    try {
        const createdCustomer = yield call(createCustomer, action.payload);
        yield put(actions.createCustomerSuccess(createdCustomer));
    } catch (error) {
        console.log(error);
        handleErrorRedirect(error);
        yield put(actions.createCustomerError(parseError(error)));
    }
};

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
        takeLatest(actions.GET_CUSTOMERS, handleGetCustomers, customerApi.getCustomers),
        takeLatest(actions.GET_CUSTOMER, handleGetCustomer, customerApi.getCustomer),
        takeEvery(actions.CREATE_CUSTOMER, handleCreateCustomer, customerApi.createCustomer),
        takeEvery(actions.UPDATE_CUSTOMER, handleUpdateCustomer, customerApi.updateCustomer),
        takeEvery(actions.DELETE_CUSTOMER, handleDeleteCustomer, customerApi.deleteCustomer),
    ])
};