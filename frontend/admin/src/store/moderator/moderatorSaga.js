import { all, call, put, takeLatest, takeEvery } from 'redux-saga/effects';

import { handleErrorRedirect, parseError } from '../../config/utils';
import * as actions from './moderatorActions';

export function* handleGetModerators(getModerators) {
    try {
        const moderators = yield call(getModerators);
        yield put(actions.getModeratorsSuccess(moderators));
    } catch (error) {
        console.log(error);
        handleErrorRedirect(error);
        yield put(actions.getModeratorsError(parseError(error)));
    }
};

export function* moderatorSaga(moderatorApi) {
    yield all([
        takeLatest(actions.GET_MODERATORS, handleGetModerators, moderatorApi.getModerators),
    ])
}
