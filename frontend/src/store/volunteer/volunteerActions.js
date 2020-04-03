export const GET_VOLUNTEER = 'GET_VOLUNTEER';
export const GET_VOLUNTEER_SUCCESS = 'GET_VOLUNTEER_SUCCESS';
export const GET_VOLUNTEER_ERROR = 'GET_VOLUNTEER_ERROR';
export const CREATE_VOLUNTEER = 'CREATE_VOLUNTEER';
export const CREATE_VOLUNTEER_SUCCESS = 'CREATE_VOLUNTEER_SUCCESS';
export const CREATE_VOLUNTEER_ERROR = 'CREATE_VOLUNTEER_ERROR';

export const getVolunteer = uuid => ({
    type: GET_VOLUNTEER,
    payload: uuid,
});
export const getVolunteerSuccess = volunteer => ({
    type: GET_VOLUNTEER_SUCCESS,
    payload: volunteer,
});
export const getVolunteerError = (error, meta) => ({
    type: GET_VOLUNTEER_ERROR,
    payload: error,
    meta,
    error: true,
});

export const createVolunteer = volunteer => ({
    type: CREATE_VOLUNTEER,
    payload: volunteer,
});
export const createVolunteerSuccess = volunteer => ({
    type: CREATE_VOLUNTEER_SUCCESS,
    payload: volunteer,
});
export const createVolunteerError = (error, meta) => ({
    type: CREATE_VOLUNTEER_ERROR,
    payload: error,
    meta,
    error: true,
});