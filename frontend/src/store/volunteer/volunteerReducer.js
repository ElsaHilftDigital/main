import * as actions from './volunteerActions';

export const initialState = {
    createVolunteerRequestOngoing: false,
    getVolunteerRequestOngoing: false,
    volunteer: null,
    getVolunteerSuccess: null,
    getVolunteerError: null,
    createVolunteerSuccess: null,
    createVolunteerError: null,
    volunteers: [],
};

export default function volunteerReducer(state = initialState, action) {
    const { type, payload } = action;

    switch(type) {
        case actions.CREATE_VOLUNTEER:
            return {
                ...state,
                createVolunteerRequestOngoing: true,
                createVolunteerSuccess: null,
                createVolunteerError: null,
            };
        case actions.CREATE_VOLUNTEER_SUCCESS:
            return {
                ...state,
                volunteer: payload,
                createVolunteerRequestOngoing: false,
                createVolunteerSuccess: true,
                createVolunteerError: null,
            };
        case actions.CREATE_VOLUNTEER_ERROR:
            return {
                ...state,
                createVolunteerRequestOngoing: false,
                createVolunteerSuccess: false,
                createVolunteerError: payload,
            };
        case actions.GET_VOLUNTEER:
            return {
                ...state,
                getVolunteerRequestOngoing: true,
                getVolunteerSuccess: null,
                getVolunteerError: null,
            };
        case actions.GET_VOLUNTEER_SUCCESS:
            return {
                ...state,
                volunteer: payload,
                getVolunteerRequestOngoing: false,
                getVolunteerSuccess: true,
                getVolunteerError: null,
            };
        case actions.GET_VOLUNTEER_ERROR:
            return {
                ...state,
                getVolunteerRequestOngoing: false,
                getVolunteerSuccess: false,
                getVolunteerError: payload,
            };
        case actions.GET_ALL_VOLUNTEERS_SUCCESS:
            return {
                ...state,
                volunteers: payload,
                volunteer: payload.length ? payload[0] : null,
            };
        case actions.SET_CURRENT_VOLUNTEER:
            const volunteer = state.volunteers.find(volunteer => volunteer.uuid === payload);
            return {
                ...state,
                volunteer: volunteer.length ? volunteer[0] : volunteer,
            };
        default:
            return state;
    }
};