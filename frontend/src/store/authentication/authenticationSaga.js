import { all, call, put, takeLatest } from 'redux-saga/effects';

import history from '../../history';
import * as actions from './authenticationActions';

export function* handleGetAuthInstance(getAutchInstance) {
    try {
        const response = yield call(getAutchInstance);
        yield put(actions.getAuthInstanceSuccess(response));
    } catch (error) {
        console.log(error);
    }
}

export function* handleLogin(authApi, action) {
    try {
        yield call([authApi, authApi.login], action.payload);
        const response = yield call([authApi, authApi.getAuthInstance]);
        if (response) {
            history.push('/admin/pruchases');
        }
        yield put(actions.getAuthInstanceSuccess(response));
    } catch (error) {
        if (error.response && error.response.data) {
            yield put(actions.loginError(error.response.data));
        } else {
            yield put(actions.loginError(error));
        }
    }
}

export function* handleLogout(authApi) {
    try {
        yield call([authApi, authApi.logout]);
    } catch (error) {
        if (history.location.pathname.match(/^\/admin.*$/i)) {
            history.push('/');
        }
        // logout returns 401 if successful
        try {
            const response = yield call([authApi, authApi.getAuthInstance]);
            yield put(actions.getAuthInstance(response));
        } catch (error) {
            console.log(error);
        }
    }
}

export function* authenticationSaga(authenticationApi) {
    yield all([
        takeLatest(actions.GET_AUTH_INSTANCE, handleGetAuthInstance, authenticationApi.getAuthInstance),
        takeLatest(actions.LOGIN, handleLogin, authenticationApi),
        takeLatest(actions.LOGOUT, handleLogout, authenticationApi),
    ])
}