import * as actions from './authenticationActions';

export const initialState = {
    currentUser: null,
    authError: null,
    loginError: null,
};

export default function authenticationReducer(state = initialState, action) {
    const { type, payload } = action;

    switch(type) {
        case actions.GET_AUTH_INSTANCE: 
            return {
                ...state,
                authError: null,
            };
        case actions.GET_AUTH_INSTANCE_SUCCESS:
            return {
                ...state,
                currentUser: payload,
            };
        case actions.GET_AUTH_INSTANCE_ERROR:
            return {
                ...state,
                currentUser: null,
                authError: payload
            };
        case actions.LOGIN:
            return {
                ...state,
                loginError: null,
            };
        case actions.LOGIN_ERROR:
            return {
                ...state,
                loginError: payload,
            };
        default:
            return state;
    }
};