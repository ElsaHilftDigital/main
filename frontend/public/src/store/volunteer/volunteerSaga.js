import { all, call, put, takeEvery, takeLatest } from 'redux-saga/effects';

import { parseError } from '../../config/utils';
import * as actions from './volunteerActions';


export function* handleCreateVolunteer(createVolunteer, action) {
    try {
        const createdVolunteer = yield call(createVolunteer, action.payload);
        yield put(actions.createVolunteerSuccess(createdVolunteer));
    } catch (error) {
        console.log(error);
        yield put(actions.createVolunteerError(parseError(error)));
    }
};

export function* volunteerSaga(volunteerApi) {
    yield all([
        takeEvery(actions.CREATE_VOLUNTEER, handleCreateVolunteer, volunteerApi.createVolunteer),
    ])
};