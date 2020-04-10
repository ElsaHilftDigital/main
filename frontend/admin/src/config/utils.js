import history from '../history';

export const parseError = e => {
    if (e.response && e.response.data) {
        return e.response.data;
    }

    return e;
}

export const handleErrorRedirect = error => {
    if (error.response && error.response.status === 401) {
        // redirect to admin login
        history.push('/login');
    }
}