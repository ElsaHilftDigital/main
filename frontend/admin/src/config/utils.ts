import history from '../history';
import moment, { Moment } from "moment";

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

export const formatDate = (timestamp: string) => {
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