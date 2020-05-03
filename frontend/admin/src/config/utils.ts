import history from '../history';
import moment, {Moment} from "moment";
import axios from "axios";
import {Cookies} from "react-cookie";

export function restClient(apiPath: string) {
    const client = axios.create({baseURL: apiPath});
    client.interceptors.response.use(response => {
        return response
    }, error => {
        if (error.response && error.response.status === 401) {
            const cookies = new Cookies()
            cookies.remove('token');
            window.location.href = "#login";
        }
        return Promise.reject(error);
    })
    return client;
}

export const parseError = (e: any) => {
    if (e.response && e.response.data) {
        return e.response.data;
    }

    return e;
}

export const handleErrorRedirect = (error: any) => {
    if (error.response && error.response.status === 401) {
        // redirect to admin login
        history.push('/login');
    }
}

export const formatMoment = (moment: Moment) => {
    return moment.format('DD.MM.YYYY');
}

export const formatDate: (timestamp: string) => string = timestamp => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('de-DE');
}

export const formatDateTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString('de-DE');
}

const datePattern = /^\d{1,2}\.\d{1,2}\.\d{4}$/;

export function parseDate(dateString: string): Moment | undefined {
    if (!datePattern.test(dateString)) {
        return;
    }
    const date = moment(dateString, 'DD.MM.YYYY');
    if (date.isValid()) {
        return date;
    }
}

export const formatBoolean = (value?: boolean) => value ? "Ja" : "Nein";