import { all, call, put, takeLatest } from 'redux-saga/effects';

import * as actions from './volunteerActions';

export function* handleCreateVolunteer(createVolunteer, action) {
    try {
        const volunteer = yield call(createVolunteer, action.payload);
        yield put(actions.createVolunteerSuccess(volunteer));
    } catch (error) {
        console.log(error);
        if (error.response && error.response.data) {
            yield put(actions.createVolunteerError(error.response.data));
        } else {
            yield put(actions.createVolunteerError(error));
        }
    }
}

export function* handleGetVolunteer(getVolunteer, action) {
    try {
        const volunteer = yield call(getVolunteer, action.payload);
        yield put(actions.getVolunteerSuccess(volunteer));
    } catch (error) {
        if (error.response && error.response.data) {
            yield put(actions.getVolunteerError(error.response.data));
        } else {
            yield put(actions.getVolunteerError(error));
        }
    }
}

export function* volunteerSaga(volunteerApi) {
    yield all([
        takeLatest(actions.CREATE_VOLUNTEER, handleCreateVolunteer, volunteerApi.createVolunteer),
        takeLatest(actions.GET_VOLUNTEER, handleGetVolunteer, volunteerAp.getVolunteeri),
    ])
}