export const GET_VOLUNTEERS = 'GET_VOLUNTEERS';
export const GET_VOLUNTEERS_SUCCESS = 'GET_VOLUNTEERS_SUCCESS';
export const GET_VOLUNTEERS_ERROR = 'GET_VOLUNTEERS_ERROR';

export const GET_VOLUNTEER = 'GET_VOLUNTEER';
export const GET_VOLUNTEER_SUCCESS = 'GET_VOLUNTEER_SUCCESS';
export const GET_VOLUNTEER_ERROR = 'GET_VOLUNTEER_ERROR';

export const CREATE_VOLUNTEER = 'CREATE_VOLUNTEER';
export const CREATE_VOLUNTEER_SUCCESS = 'CREATE_VOLUNTEER_SUCCESS';
export const CREATE_VOLUNTEER_ERROR = 'CREATE_VOLUNTEER_ERROR';

export const UPDATE_VOLUNTEER = 'UPDATE_VOLUNTEER';
export const UPDATE_VOLUNTEER_SUCCESS = 'UPDATE_VOLUNTEER_SUCCESS';
export const UPDATE_VOLUNTEER_ERROR = 'UPDATE_VOLUNTEER_ERROR';

export const DELETE_VOLUNTEER = 'DELETE_VOLUNTEER';
export const DELETE_VOLUNTEER_SUCCESS = 'DELETE_VOLUNTEER_SUCCESS';
export const DELETE_VOLUNTEER_ERROR = 'DELETE_VOLUNTEER_ERROR';

export const VALIDATE_VOLUNTEER = 'VALIDATE_VOLUNTEER';
export const VALIDATE_VOLUNTEER_SUCCESS = 'VALIDATE_VOLUNTEER_SUCCESS';
export const VALIDATE_VOLUNTEER_ERROR = 'VALIDATE_VOLUNTEER_ERROR';

export const GET_COMPLETED_PURCHASE_LIST = 'GET_COMPLETED_PURCHASE_LIST';
export const GET_COMPLETED_PURCHASE_LIST_SUCCESS = 'GET_COMPLETED_PURCHASE_LIST_SUCCESS';
export const GET_COMPLETED_PURCHASE_LIST_ERROR = 'GET_COMPLETED_PURCHASE_LIST_ERROR';

export const GET_OPEN_PURCHASE_LIST = 'GET_OPEN_PURCHASE_LIST';
export const GET_OPEN_PURCHASE_LIST_SUCCESS = 'GET_OPEN_PURCHASE_LIST_SUCCESS';
export const GET_OPEN_PURCHASE_LIST_ERROR = 'GET_OPEN_PURCHASE_LIST_ERROR';


export const getVolunteers = () => ({
    type: GET_VOLUNTEERS,
});
export const getVolunteersSuccess = volunteers => ({
    type: GET_VOLUNTEERS_SUCCESS,
    payload: volunteers,
});
export const getVolunteersError = error => ({
    type: GET_VOLUNTEERS_ERROR,
    payload: error,
});

export const getVolunteer = uuid => ({
    type: GET_VOLUNTEER,
    payload: uuid,
});
export const getVolunteerSuccess = volunteer => ({
    type: GET_VOLUNTEER_SUCCESS,
    payload: volunteer,
});
export const getVolunteerError = error => ({
    type: GET_VOLUNTEER_ERROR,
    payload: error,
    error: true,
});

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

export const updateVolunteer = (uuid, volunteer) => ({
    type: UPDATE_VOLUNTEER,
    payload: { uuid, volunteer },
});
export const updateVolunteerSuccess = () => ({
    type: UPDATE_VOLUNTEER_SUCCESS,
});
export const updateVolunteerError = error => ({
    type: UPDATE_VOLUNTEER_ERROR,
    payload: error,
    error: true,
});

export const deleteVolunter = uuid => ({
    type: DELETE_VOLUNTEER,
    payload: uuid,
});
export const deleteVolunteerSuccess = uuid => ({
    type: DELETE_VOLUNTEER_SUCCESS,
});
export const deleteVolunteerError = error => ({
    type: DELETE_VOLUNTEER,
    payload: error,
    error: true,
});

export const validateVolunteer = uuid => ({
    type: VALIDATE_VOLUNTEER,
    payload: uuid,
});
export const validateVolunteerSuccess = () => ({
    type: VALIDATE_VOLUNTEER_SUCCESS,
});
export const validateVolunteerError = error => ({
    type: VALIDATE_VOLUNTEER_ERROR,
    payload: error,
    error: true,
});

export const getCompletedPurchaseList = uuid => ({
    type: GET_COMPLETED_PURCHASE_LIST,
    payload: uuid,
});
export const getCompletedPurchaseListSuccess = completedPurchaseList => ({
    type: GET_COMPLETED_PURCHASE_LIST_SUCCESS,
    payload: completedPurchaseList,
});
export const getCompletedPurchaseListError = error => ({
    type: GET_COMPLETED_PURCHASE_LIST_ERROR,
    payload: error,
    error: true,
});

export const getOpenPurchaseList = uuid => ({
    type: GET_OPEN_PURCHASE_LIST,
    payload: uuid,
});
export const getOpenPurchaseListSuccess = openPurchaseList => ({
    type: GET_OPEN_PURCHASE_LIST_SUCCESS,
    payload: openPurchaseList,
});
export const getOpenPurchaseListError = error => ({
    type: GET_OPEN_PURCHASE_LIST_ERROR,
    payload: error,
    error: true,
});