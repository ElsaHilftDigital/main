import { all, call, put, takeLatest, takeEvery } from 'redux-saga/effects';

import history from '../../history';
import * as actions from './customerActions';

export function* handleGetAllCustomers(getCustomers) {
    try {
        const customers = yield call(getCustomers);
        yield put(actions.getAllCustomersSuccess(customers));
    } catch (error) {
        console.log(error);
        if (error.response && error.response.status === 401) {
            // redirect to admin login
            history.push('/admin');
        }
    }
}

export function* handleGetCustomer(getCustomer, action) {
    try {
        const customer = yield call(getCustomer, action.payload);
        yield put(actions.getCustomerSuccess(customer));
    } catch (error) {
        console.log(error);
        if (error.response && error.response.status === 401) {
            // redirect to admin login
            history.push('/admin');
        }
    }
}

export function* handleCreateCustomer(createCustomer, action) {
    try {
        const createdCustomer = yield call(createCustomer, action.payload);
        yield put(actions.createCustomerSuccess(createdCustomer));
    } catch (error) {
        console.log(error);
        if (error.response && error.response.data) {
            yield put(actions.createCustomerError(error.response.data));
        } else {
            yield put(actions.createCustomerError(error));
        }
        if (error.response && error.response.status === 401) {
            // redirect to admin login
            history.push('/admin');
        }
    }
}

export function* customerSaga(customerApi) {
    yield all([
        takeLatest(actions.GET_ALL_CUSTOMERS, handleGetAllCustomers, customerApi.getCustomers),
        takeEvery(actions.CREATE_CUSTOMER, handleCreateCustomer, customerApi.createCustomer),
        takeLatest(actions.GET_CUSTOMER, handleGetCustomer, customerApi.getCustomer),
    ])
}