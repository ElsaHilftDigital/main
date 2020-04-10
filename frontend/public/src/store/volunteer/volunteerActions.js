export const CREATE_VOLUNTEER = 'CREATE_VOLUNTEER';
export const CREATE_VOLUNTEER_SUCCESS = 'CREATE_VOLUNTEER_SUCCESS';
export const CREATE_VOLUNTEER_ERROR = 'CREATE_VOLUNTEER_ERROR';



export const createVolunteer = volunteer => ({
    type: CREATE_VOLUNTEER,
    payload: volunteer,
});
export const createVolunteerSuccess = createdVolunteer => ({
    type: CREATE_VOLUNTEER_SUCCESS,
    payload: createdVolunteer,
});
export const createVolunteerError = error => ({
    type: CREATE_VOLUNTEER_ERROR,
    payload: error,
    error: true,
});

