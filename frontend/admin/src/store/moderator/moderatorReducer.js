import * as actions from './moderatorActions';

export const initialState = {
    moderators: [],
    getModeratorsRequestOngoing: false,
    getModeratorsError: null,
};

export default function moderatorReducer(state = initialState, action) {
    const { type, payload } = action;

    switch(type) {
        // get moderators
        case actions.GET_MODERATORS:
            return {
                ...state,
                getModeratorsError: null,
                getModeratorsRequestOngoing: true,
            };
        case actions.GET_MODERATORS_SUCCESS:
            return {
                ...state,
                moderators: payload,
                getModeratorsRequestOngoing: false,
            };
        case actions.GET_MODERATORS_ERROR:
            return {
                ...state,
                getModeratorsError: payload,
                getModeratorsRequestOngoing: false,
            }
        default:
            return state;
    }
};
