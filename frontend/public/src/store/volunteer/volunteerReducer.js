import * as actions from './volunteerActions';

export const initialState = {
    
    createVolunteerRequestOngoing: false,
    createVolunteerSuccess: null,
    createVolunteerError: null,

    selectedVolunteer: null,
};

export default function volunteerReducer(state = initialState, action) {
    const { type, payload } = action;

    switch(type) {
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
        default:
            return state;
    }
};