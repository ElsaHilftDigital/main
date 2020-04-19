import * as actions from './authenticationActions';

export const initialState = {
    authError: null,
    loginError: null,
};

export default function authenticationReducer(state = initialState, action) {
    const { type, payload } = action;

    switch(type) {
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