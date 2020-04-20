import { all, call, put, takeLatest } from 'redux-saga/effects';

import { parseError } from '../../config/utils';
import * as actions from './authenticationActions';

export function* handleLogin(authApi, action) {
    try {
        yield call([authApi, authApi.login], action.payload);
    } catch (error) {
        console.log(error);
        yield put(actions.loginError(parseError(error)));
    }
};

export function* authenticationSaga(authenticationApi) {
    yield all([
        takeLatest(actions.LOGIN, handleLogin, authenticationApi),
    ])
};