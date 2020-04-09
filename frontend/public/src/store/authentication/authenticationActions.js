export const GET_AUTH_INSTANCE = 'GET_AUTH_INSTANCE';
export const GET_AUTH_INSTANCE_SUCCESS = 'GET_AUTH_INSTANCE_SUCCESS';
export const GET_AUTH_INSTANCE_ERROR = 'GET_AUTH_INSTANCE_ERROR';
export const LOGIN = 'LOGIN';
export const LOGIN_ERROR = 'LOGIN_ERROR';
export const LOGOUT = 'LOGOUT';
export const LOGOUT_ERROR = 'LOGOUT';

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

export const login = auth => ({
    type: LOGIN,
    payload: auth,
});
export const loginError = error => ({
    type: LOGIN_ERROR,
    payload: error,
    error: true,
});

export const logout = () => ({
    type: LOGOUT,
});
export const logoutError = error => ({
    type: LOGOUT_ERROR,
    payload: error,
    error: true,
})



