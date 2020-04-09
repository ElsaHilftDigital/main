import * as actions from './volunteerActions';

export const initialState = {
    volunteers: [],
    getVolunteersRequestOngoing: false,
    getVolunteersError: null,

    currentVolunteer: null,
    getVolunteerRequestOngoing: false,
    getVolunteerError: false,

    createVolunteerRequestOngoing: false,
    createVolunteerSuccess: null,
    createVolunteerError: null,

    updateVolunteerRequestOngoing: false,
    updateVolunteerError: null,

    deleteVolunteerRequestOngoing: false,
    deleteVolunteerError: false,

    validateVolunteerRequestOngoing: false,
    validateVolunteerError: null,

    currentCompletedPurchaseList: [],
    getCompletedPurchaseListRequestOngoing: false,
    getCompletedPurchaseListError: null,

    currentOpenPurchaseList: [],
    getOpenPurchaseListRequestOngoing: false,
    getOpenPurchaseListError: null,

    selectedVolunteer: null,
};

export default function volunteerReducer(state = initialState, action) {
    const { type, payload } = action;

    switch(type) {
        // get volunteers
        case actions.GET_VOLUNTEERS:
            return {
                ...state,
                getVolunteersError: null,
                getVolunteersRequestOngoing: true,
            };
        case actions.GET_VOLUNTEERS_SUCCESS:
            return {
                ...state,
                volunteers: payload,
                getVolunteersRequestOngoing: false,
            };
        case actions.GET_VOLUNTEERS_ERROR:
            return {
                ...state,
                getVolunteersError: payload,
                getVolunteersRequestOngoing: false,
            };
        // get volunteer
        case actions.GET_VOLUNTEER:
            return {
                ...state,
                getVolunteerError: null,
                getVolunteerRequestOngoing: true,
            };
        case actions.GET_VOLUNTEER_SUCCESS:
            return {
                ...state,
                currentVolunteer: payload,
                getVolunteerRequestOngoing: false,
            };
        case actions.GET_VOLUNTEER_ERROR:
            return {
                ...state,
                getVolunteerError: payload,
                getVolunteerRequestOngoing: false,
            };
        // create volunteer
        case actions.CREATE_VOLUNTEER:
            return {
                ...state,
                createVolunteerSuccess: null,
                createVolunteerError: null,
                createVolunteerRequestOngoing: true,
            };
        case actions.CREATE_VOLUNTEER_SUCCESS:
            return {
                ...state,
                createVolunteerSuccess: payload,
                createVolunteerRequestOngoing: false,
            };
        case actions.CREATE_VOLUNTEER_ERROR:
            return {
                ...state,
                createVolunteerError: payload,
                createVolunteerRequestOngoing: false,
            };
        // update volunteer
        case actions.UPDATE_VOLUNTEER: 
            return {
                ...state,
                updateVolunteerError: null,
                updateVolunteerRequestOngoing: true,
            };
        case actions.UPDATE_VOLUNTEER_SUCCESS:
            return {
                ...state,
                updateVolunteerRequestOngoing: false,
            };
        case actions.UPDATE_VOLUNTEER_ERROR:
            return {
                ...state,
                updateVolunteerError: payload,
                updateVolunteerRequestOngoing: false,
            };
        // delete volunteer
        case actions.DELETE_VOLUNTEER: 
            return {
                ...state,
                deleteVolunteerError: null,
                deleteVolunteerRequestOngoing: true,
            };
        case actions.DELETE_VOLUNTEER_SUCCESS:
            return {
                ...state,
                deleteVolunteerRequestOngoing: false,
            };
        case actions.DELETE_VOLUNTEER_ERROR:
            return {
                ...state,
                deleteVolunteerError: payload,
                deleteVolunteerRequestOngoing: false,
            };
        // validate volunteer
        case actions.VALIDATE_VOLUNTEER:
            return {
                ...state,
                validateVolunteerError: null,
                validateVolunteerRequestOngoing: true,
            };
        case actions.VALIDATE_VOLUNTEER_SUCCESS:
            return {
                ...state,
                validateVolunteerRequestOngoing: false,
            };
        case actions.VALIDATE_VOLUNTEER_ERROR:
            return {
                ...state,
                validateVolunteerError: payload,
                validateVolunteerRequestOngoing: false,
            };
        // get completed purchase list
        case actions.GET_COMPLETED_PURCHASE_LIST:
            return {
                ...state,
                getCompletedPurchaseListError: null,
                getCompletedPurchaseListRequestOngoing: true,
            };
        case actions.GET_COMPLETED_PURCHASE_LIST_SUCCESS:
            return {
                ...state,
                currentCompletedPurchaseList: payload,
                getCompletedPurchaseListRequestOngoing: false,
            };
        case actions.GET_COMPLETED_PURCHASE_LIST_ERROR:
            return {
                ...state,
                getCompletedPurchaseListError: payload,
                getCompletedPurchaseListRequestOngoing: false,
            };
        // get open purchase list
        case actions.GET_OPEN_PURCHASE_LIST:
            return {
                ...state,
                getOpenPurchaseListError: null,
                getOpenPurchaseListRequestOngoing: true,
            };
        case actions.GET_OPEN_PURCHASE_LIST_SUCCESS:
            return {
                ...state,
                currentOpenPurchaseList: payload,
                getOpenPurchaseListRequestOngoing: false,
            };
        case actions.GET_OPEN_PURCHASE_LIST_ERROR:
            return {
                ...state,
                getOpenPurchaseListError: payload,
                getCompletedPurchaseListRequestOngoing: false
            };
        default:
            return state;
    }
};