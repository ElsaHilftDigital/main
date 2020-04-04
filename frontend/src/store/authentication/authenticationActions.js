export const GET_AUTH_INSTANCE = 'GET_AUTH_INSTANCE';
export const GET_AUTH_INSTANCE_SUCCESS = 'GET_AUTH_INSTANCE_SUCCESS';
export const GET_AUTH_INSTANCE_ERROR = 'GET_AUTH_INSTANCE_ERROR';
export const LOGIN = 'LOGIN';
export const LOGOUT = 'LOGOUT';

export const getAuthInstance = () => ({
    type: GET_AUTH_INSTANCE,
});
export const getAuthInstanceSuccess = response => ({
    type: GET_AUTH_INSTANCE_SUCCESS,
    payload: response,
});
export const getAuthInstanceError = (error, meta) => ({
    type: GET_AUTH_INSTANCE_ERROR,
    payload: error,
    meta,
    error: true,
});

export const login = () => ({
    type: LOGIN,
});
export const logout = () => ({
    type: LOGOUT,
});



