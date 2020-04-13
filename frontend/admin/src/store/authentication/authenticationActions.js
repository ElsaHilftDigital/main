export const LOGIN = 'LOGIN';
export const LOGIN_ERROR = 'LOGIN_ERROR';

export const login = auth => ({
    type: LOGIN,
    payload: auth,
});
export const loginError = error => ({
    type: LOGIN_ERROR,
    payload: error,
    error: true,
});