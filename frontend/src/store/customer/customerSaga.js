import { all, call, put, takeLatest, takeEvery } from 'redux-saga/effects';

import { handleErrorRedirect, parseError } from '../../config/utils';
import * as actions from './customerActions';


export function* handleGetCustomers(customerApi) {
    try {
        const customers = yield call([customerApi, getCustomers]);
        yield put(actions.getCustomersSuccess(customers));
    } catch (error) {
        console.log(error);
        handleErrorRedirect(error);
        yield put(actions.getCustomersError(parseError(error)));
    }
};

export function* handleGetCustomer(customerApi, action) {
    try {
        const customer = yield call([customerApi, getCustomer], action.payload);
        yield put(actions.getCustomerSuccess(customer));
    } catch (error) {
        console.log(error);
        handleErrorRedirect(error);
        yield put(actions.getCustomerError(parseError(error)));
    }
};

export function* handleGetCompletedPurchaseList(customerApi, action) {
    try {
        const completedPurchaseList = yield call([customerApi, getCompletedPurchaseList], action.payload);
        yield put(actions.getCompletedPurchaseListSuccess(completedPurchaseList));
    } catch (error) {
        console.log(error);
        handleErrorRedirect(error);
        yield put(actions.getCompletedPurchaseListError(parseError(error)));
    }
};

export function* handleGetOpenPurchaseList(customerApi, action) {
    try {
        const openPurchaseList = yield call([customerApi, getOpenPurchaseList], action.payload);
        yield put(actions.getOpenPurchaseListSuccess(openPurchaseList));
    } catch (error) {
        console.log(error);
        handleErrorRedirect(error);
        yield put(actions.getOpenPurchaseListError(parseError(error)));
    }
};

export function* handleCreateCustomer(customerApi, action) {
    try {
        const createdCustomer = yield call([customerApi, createCustomer], action.payload);
        yield put(actions.createCustomerSuccess(createdCustomer));
    } catch (error) {
        console.log(error);
        handleErrorRedirect(error);
        yield put(actions.createCustomerError(parseError(error)));
    }
};

export function* handleUpdateCustomer(customerApi, action) {
    try {
        const { uuid, customer } = action.payload;
        yield call([customerApi, updateCustomer], uuid, customer);
        yield put(actions.updateCustomerSuccess());
    } catch (error) {
        console.log(error);
        handleErrorRedirect(error);
        yield put(actions.updateCustomerError(parseError(error)));
    }
};

export function* handleDeleteCustomer(customerApi, action) {
    try {
        yield call([customerApi, deleteCustomer], action.payload);
        yield put(actions.deleteCustomerSuccess());
    } catch (error) {
        console.log(error);
        handleErrorRedirect(error);
        yield put(actions.deleteCustomerError(parseError(error)));
    }
};


export function* customerSaga(customerApi) {
    yield all([
        takeLatest(actions.GET_CUSTOMERS, handleGetCustomers, customerApi),
        takeLatest(actions.GET_CUSTOMER, handleGetCustomer, customerApi),
        takeLatest(actions.GET_COMPLETED_PURCHASE_LIST, handleGetCompletedPurchaseList, customerApi),
        takeLatest(actions.GET_OPEN_PURCHASE_LIST, handleGetOpenPurchaseList, customerApi),
        takeEvery(actions.CREATE_CUSTOMER, handleCreateCustomer, customerApi),
        takeEvery(actions.UPDATE_CUSTOMER, handleUpdateCustomer, customerApi),
        takeEvery(actions.DELETE_CUSTOMER, handleDeleteCustomer, customerApi),
    ])
};