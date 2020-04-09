import { all, call, put, takeEvery, takeLatest } from 'redux-saga/effects';

import { handleErrorRedirect, parseError } from '../../config/utils';
import * as actions from './volunteerActions';


export function* handleGetVolunteers(getVolunteers) {
    try {
        const volunteers = yield call(getVolunteers);
        yield put(actions.getVolunteersSuccess(volunteers));
    } catch (error) {
        console.log(error);
        handleErrorRedirect(error);
        yield put(actions.getVolunteersError(parseError(error)));
    }
};

export function* handleGetVolunteer(getVolunteer, action) {
    try {
        const volunteer = yield call(getVolunteer, action.payload);
        yield put(actions.getVolunteerSuccess(volunteer));
    } catch (error) {
        console.log(error);
        handleErrorRedirect(error);
        yield put(actions.getVolunteerError(parseError(error)));
    }
};

export function* handleCreateVolunteer(createVolunteer, action) {
    try {
        const createdVolunteer = yield call(createVolunteer, action.payload);
        yield put(actions.createVolunteerSuccess(createdVolunteer));
    } catch (error) {
        console.log(error);
        handleErrorRedirect(error);
        yield put(actions.createVolunteerError(parseError(error)));
    }
};

export function* handleUpdateVolunteer(updateVolunteer, action) {
    try {
        const { uuid, volunteer } = action.payload;
        yield call(updateVolunteer, uuid, volunteer);
        yield put(actions.updateVolunteerSuccess());
    } catch (error) {
        console.log(error);
        handleErrorRedirect(error);
        yield put(actions.updateVolunteerError(parseError(error)));
    }
};

export function* handleDeleteVolunteer(deleteVolunteer, action) {
    try {
        yield call(deleteVolunteer, action.payload);
        yield put(actions.deleteVolunteerSuccess());
    } catch (error) {
        console.log(error);
        handleErrorRedirect(error);
        yield put(actions.deleteVolunteerError(parseError(error)));
    }
}

export function* handleValidateVolunteer(validateVolunteer, action) {
    try {
        yield call(validateVolunteer, action.payload);
        yield put(actions.validateVolunteerSuccess());
    } catch (error) {
        console.log(error);
        handleErrorRedirect(error);
        yield put(actions.validateVolunteerError(parseError(error)));
    }
}

export function* handleGetCompletedPurchaseList(getCompletedPurchaseList, action) {
    try {
        const completedPurchaseList = yield call(getCompletedPurchaseList, action.payload);
        yield put(actions.getCompletedPurchaseListSuccess(completedPurchaseList));
    } catch (error) {
        console.log(error);
        handleErrorRedirect(error);
        yield put(actions.getCompletedPurchaseListError(parseError(error)));
    }
};

export function* handleGetOpenPurchaseList(getOpenPurchaseList, action) {
    try {
        const openPurchaseList = yield call(getOpenPurchaseList, action.payload);
        yield put(actions.getOpenPurchaseListSuccess(openPurchaseList));
    } catch (error) {
        console.log(error);
        handleErrorRedirect(error);
        yield put(actions.getOpenPurchaseListError(parseError(error)));
    }
};


export function* volunteerSaga(volunteerApi) {
    yield all([
        takeLatest(actions.GET_VOLUNTEERS, handleGetVolunteers, volunteerApi.getVolunteers),
        takeLatest(actions.GET_VOLUNTEER, handleGetVolunteer, volunteerApi.getVolunteer),
        takeEvery(actions.CREATE_VOLUNTEER, handleCreateVolunteer, volunteerApi.createVolunteer),
        takeEvery(actions.UPDATE_VOLUNTEER, handleUpdateVolunteer, volunteerApi.updateVolunteer),
        takeEvery(actions.DELETE_VOLUNTEER, handleDeleteVolunteer, volunteerApi.deleteVolunteer),
        takeEvery(actions.VALIDATE_VOLUNTEER, handleValidateVolunteer, volunteerApi.validateVolunteer),
        takeLatest(actions.GET_COMPLETED_PURCHASE_LIST, handleGetCompletedPurchaseList, volunteerApi.getCompletedPurchaseList),
        takeLatest(actions.GET_OPEN_PURCHASE_LIST, handleGetOpenPurchaseList, volunteerApi.getOpenPurchaseList),
    ])
};