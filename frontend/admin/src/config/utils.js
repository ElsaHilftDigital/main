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

export const formatDate = timestamp => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('de-DE');
}

export const formatDateTime = timestamp => {
    const date = new Date(timestamp);
    return date.toLocaleString('de-DE');
}

export const parseDate = localdate => {
    const dateSplit = localdate.indexOf('.');
    const monthSplit = localdate.indexOf('.', dateSplit + 1)
    const day = localdate.substring(0, dateSplit);
    const month = localdate.substring(dateSplit + 1, monthSplit);
    const year = localdate.substring(monthSplit + 1);
    return new Date(`${year}-${month}-${day}`);
}

export const formatBoolean = value => value ? "Ja" : "Nein";