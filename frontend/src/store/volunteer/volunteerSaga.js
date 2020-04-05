import { all, call, put, takeLatest } from 'redux-saga/effects';

import history from '../../history';
import * as actions from './volunteerActions';
import { volunteerActions } from '.';

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
        if (error.response && error.response.status === 401) {
            // redirect to admin login
            history.push('/admin');
        }
    }
}

export function* handleGetAllVolunteers(getAllVolunteers) {
    try {
        const volunteers = yield call(getAllVolunteers);
        yield put(actions.getAllVolunteersSuccess(volunteers));
    } catch (error) {
        console.log(error);
        if (error.response && error.response.status === 401) {
            // redirect to admin login
            history.push('/admin');
        }
    }
}

export function* handleConfirmVolunteer(volunteerApi, action) {
    try {
        yield call([volunteerApi, volunteerApi.confirmVolunteer], action.payload);
        yield put(volunteerActions.getVolunteer(action.payload));
    } catch (error) {
        console.log(error);
        if (error.response && error.response.status === 401) {
            // redirect to admin login
            history.push('/admin');
        }
    }
}

export function* volunteerSaga(volunteerApi) {
    yield all([
        takeLatest(actions.CREATE_VOLUNTEER, handleCreateVolunteer, volunteerApi.createVolunteer),
        takeLatest(actions.GET_VOLUNTEER, handleGetVolunteer, volunteerApi.getVolunteer),
        takeLatest(actions.GET_ALL_VOLUNTEERS, handleGetAllVolunteers, volunteerApi.getAllVolunteers),
        takeLatest(actions.CONFIRM_VOLUNTEER, handleConfirmVolunteer, volunteerApi),
    ])
}