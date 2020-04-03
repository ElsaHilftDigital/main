import { all, call, put, takeLatest } from 'redux-saga/effects';

import * as actions from './pingActions';

export function* pingBackend(ping) {
    try {
        const pingResponse = yield call(ping);
        yield put(actions.pingSuccess(pingResponse));
    } catch (error) {
        if (error.response && error.response.data) {
            yield put(actions.pingError(error.response.data));
        } else {
            yield put(actions.pingError(error));
        }
    }
}

export function* pingSaga(pingApi) {
    yield all([
        takeLatest(actions.PING, pingBackend, pingApi.ping),
    ])
}