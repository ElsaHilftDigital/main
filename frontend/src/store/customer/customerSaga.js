import { all, call, put, takeLatest } from 'redux-saga/effects';

import history from '../../history';
import * as actions from './customerActions';

export function* handleGetAllCustomers(getAllCustomers) {
    try {
        const customers = yield call(getAllCustomers);
        yield put(actions.getAllCustomersSuccess(customers));
    } catch (error) {
        console.log(error);
        if (error.response && error.response.status === 401) {
            history.push('/');
        }
    }
}

export function* customerSaga(customerApi) {
    yield all([
        takeLatest(actions.GET_ALL_CUSTOMERS, handleGetAllCustomers, customerApi.getAllCustomers),
    ])
}