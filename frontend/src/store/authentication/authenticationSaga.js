import { all, call, put, takeLatest } from 'redux-saga/effects';

import * as actions from './authenticationActions';

export function* handleGetAuthInstance(getAutchInstance) {
    try {
        const response = yield call(getAutchInstance);
        yield put(actions.getAuthInstanceSuccess(response));
    } catch (error) {
        console.log(error);
    }
}

export function* handleLogin(authApi, auth) {
    try {
        yield call([authApi, authApi.login], auth);
        const response = yield call([authApi, authApi.getAuthInstance]);
        yield put(actions.getAuthInstance(response));
    } catch (error) {
        console.log(error);
    }
}

export function* handleLogout(authApi) {
    try {
        yield call([authApi, authApi.logout]);
        const response = yield call([authApi, authApi.getAuthInstance]);
        yield put(actions.getAuthInstance(response));
    } catch (error) {
        console.log(error);
    }
}

export function* authenticationSaga(authenticationApi) {
    yield all([
        takeLatest(actions.GET_AUTH_INSTANCE, handleGetAuthInstance, authenticationApi.getAuthInstance),
        takeLatest(actions.LOGIN, handleLogin, authenticationApi),
        takeLatest(actions.LOGOUT, handleLogout, authenticationApi),
    ])
}