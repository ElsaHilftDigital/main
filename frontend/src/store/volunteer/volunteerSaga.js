import { all, call, put, takeLatest } from 'redux-saga/effects';

import { handleErrorRedirect, parseError } from '../../config/utils';
import * as actions from './volunteerActions';


export function* handleGetVolunteers(volunteerApi) {
    try {
        const volunteers = yield call([volunteerApi, getVolunteers]);
        yield put(actions.getVolunteersSuccess(volunteers));
    } catch (error) {
        console.log(error);
        handleErrorRedirect(error);
        yield put(actions.getVolunteersError(parseError(error)));
    }
};

export function* handleGetVolunteer(volunteerApi, action) {
    try {
        const volunteer = yield call([volunteerApi, getVolunteer], action.payload);
        yield put(actions.getVolunteerSuccess(volunteer));
    } catch (error) {
        console.log(error);
        handleErrorRedirect(error);
        yield put(actions.getVolunteerError(parseError(error)));
    }
};

export function* handleCreateVolunteer(volunteerApi, action) {
    try {
        const createdVolunteer = yield call([volunteerApi, createVolunteer], action.payload);
        yield put(actions.createVolunteerSuccess(createdVolunteer));
    } catch (error) {
        console.log(error);
        handleErrorRedirect(error);
        yield put(actions.createVolunteerError(parseError(error)));
    }
};

export function* handleUpdateVolunteer(volunteerApi, action) {
    try {
        const { uuid, volunteer } = action.payload;
        yield call([volunteerApi, updateVolunteer], uuid, volunteer);
        yield put(actions.updateVolunteerSuccess());
    } catch (error) {
        console.log(error);
        handleErrorRedirect(error);
        yield put(actions.updateVolunteerError(parseError(error)));
    }
};

export function* handleDeleteVolunteer(volunteerApi, action) {
    try {
        yield call([volunteerApi, deleteVolunteer], action.payload);
        yield put(actions.deleteVolunteerSuccess());
    } catch (error) {
        console.log(error);
        handleErrorRedirect(error);
        yield put(actions.deleteVolunteerError(parseError(error)));
    }
}

export function* handleValidateVolunteer(volunteerApi, action) {
    try {
        yield call([volunteerApi, validateVolunteer], action.payload);
        yield put(actions.validateVolunteerSuccess());
    } catch (error) {
        console.log(error);
        handleErrorRedirect(error);
        yield put(actions.validateVolunteerError(parseError(error)));
    }
}

export function* handleGetCompletedPurchaseList(volunteerApi, action) {
    try {
        const completedPurchaseList = yield call([volunteerApi, getCompletedPurchaseList], action.payload);
        yield put(actions.getCompletedPurchaseListSuccess(completedPurchaseList));
    } catch (error) {
        console.log(error);
        handleErrorRedirect(error);
        yield put(actions.getCompletedPurchaseListError(parseError(error)));
    }
};

export function* handleGetOpenPurchaseList(volunteerApi, action) {
    try {
        const openPurchaseList = yield call([volunteerApi, getOpenPurchaseList], action.payload);
        yield put(actions.getOpenPurchaseListSuccess(openPurchaseList));
    } catch (error) {
        console.log(error);
        handleErrorRedirect(error);
        yield put(actions.getOpenPurchaseListError(parseError(error)));
    }
};


export function* volunteerSaga(volunteerApi) {
    yield all([
        takeLatest(actions.GET_VOLUNTEERS, handleGetVolunteers, volunteerApi),
        takeLatest(actions.GET_VOLUNTEER, handleGetVolunteer, volunteerApi),
        takeEvery(actions.CREATE_VOLUNTEER, handleCreateVolunteer, volunteerApi),
        takeEvery(actions.UPDATE_VOLUNTEER, handleUpdateVolunteer, volunteerApi),
        takeEvery(actions.DELETE_VOLUNTEER, handleDeleteVolunteer, volunteerApi),
        takeEvery(actions.VALIDATE_VOLUNTEER, handleValidateVolunteer, volunteerApi),
        takeLatest(actions.GET_COMPLETED_PURCHASE_LIST, handleGetCompletedPurchaseList, volunteersApi),
        takeLatest(actions.GET_OPEN_PURCHASE_LIST, handleGetOpenPurchaseList, volunteerApi),
    ])
};