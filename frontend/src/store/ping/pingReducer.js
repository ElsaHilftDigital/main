import * as actions from './pingActions';

export const initialState = {
    pingRequestOngoing: false,
    pingResponse: null,
    pingSuccessful: null,
    pingError: null,
};

export default function pingReducer(state = initialState, action) {
    const { type, payload } = action;

    switch(type) {
        case actions.PING:
            return {
                ...state,
                pingRequestOngoing: true,
                pingSuccessful: null,
                pingError: null,
            };
        case actions.PING_SUCCESS:
            return {
                ...state,
                pingResponse: payload,
                pingRequestOngoing: false,
                pingSuccessful: true,
                pingError: null,
            };
        case actions.PING_ERROR:
            return {
                ...state,
                pingRequestOngoing: false,
                pingSuccessful: false,
                pingError: payload,
            };
        default:
            return state;
    }
};