export const GET_MODERATORS = 'GET_MODERATORS';
export const GET_MODERATORS_SUCCESS = 'GET_MODERATORS_SUCCESS';
export const GET_MODERATORS_ERROR = 'GET_MODERATORS_ERROR';

export const getModerators = () => ({
    type: GET_MODERATORS,
});
export const getModeratorsSuccess = moderators => ({
    type: GET_MODERATORS_SUCCESS,
    payload: moderators,
});
export const getModeratorsError = error => ({
    type: GET_MODERATORS_ERROR,
    payload: error,
    error: true,
});
