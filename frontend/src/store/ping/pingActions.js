export const PING = 'PING';
export const PING_SUCCESS = 'PING_SUCCESS';
export const PING_ERROR = 'PING_ERROR';

export const ping = () => ({
    type: PING,
});
export const pingSuccess = pingResponse => ({
    type: PING_SUCCESS,
    payload: pingResponse,
});

export const pingError = (error, meta) => ({
    type: PING_ERROR,
    payload: error,
    meta,
    error: true,
});


