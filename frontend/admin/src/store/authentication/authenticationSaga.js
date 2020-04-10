import { all, call, put, takeLatest } from 'redux-saga/effects';

import { parseError } from '../../config/utils';
import * as actions from './authenticationActions';
import history from '../../history';

export function* handleGetAuthInstance(authApi) {
    try {
        const response = yield call([authApi, authApi.getAuthInstance]);
        yield put(actions.getAuthInstanceSuccess(response));
    } catch (error) {
        console.log(error);
        yield put(actions.getAuthInstanceError(parseError(error)));
    }
};

export function* handleLogin(authApi, action) {
    try {
        yield call([authApi, authApi.login], action.payload);
        yield put(actions.getAuthInstance());
        history.push('/');
    } catch (error) {
        console.log(error);
        yield put(actions.loginError(parseError(error)));
    }
};

export function* authenticationSaga(authenticationApi) {
    yield all([
        takeLatest(actions.GET_AUTH_INSTANCE, handleGetAuthInstance, authenticationApi),
        takeLatest(actions.LOGIN, handleLogin, authenticationApi),
    ])
};