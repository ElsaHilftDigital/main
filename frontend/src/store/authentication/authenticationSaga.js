import { all, call, put, takeLatest } from 'redux-saga/effects';

import history from '../../history';
import { parseError } from '../../config/utils';
import * as actions from './authenticationActions';

export function* handleGetAuthInstance(authApi) {
    try {
        const response = yield call([authApi, authApi]);
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
        history.push('/admin/purchases');
    } catch (error) {
        console.log(error);
        yield put(actions.loginError(parseError(error)));
    }
};

export function* handleLogout(authApi) {
    try {
        yield call([authApi, authApi.logout]);
        yield put(actions.getAuthInstance());
        if (history.location.pathname.match(/^\/admin.*$/i)) {
            history.push('/admin');
        }
    } catch (error) {
        if (error.response && error.response.status === '401') {
            // logout returns 401 if successful
            yield put(actions.getAuthInstance());
            if (history.location.pathname.match(/^\/admin.*$/i)) {
                history.push('/admin');
            }
        } else {
            console.log(error);
            yield put(actions.logoutError(parseError(error)));
        }
    }
};

export function* authenticationSaga(authenticationApi) {
    yield all([
        takeLatest(actions.GET_AUTH_INSTANCE, handleGetAuthInstance, authenticationApi),
        takeLatest(actions.LOGIN, handleLogin, authenticationApi),
        takeLatest(actions.LOGOUT, handleLogout, authenticationApi),
    ])
};