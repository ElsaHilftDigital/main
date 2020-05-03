import axios from 'axios';
import { restClient } from '../config/utils';
import { useEffect, useState } from 'react';

const client = restClient('/api/v1/admin');

export interface Volunteer {
    uuid: string,
    firstName: string,
    lastName: string,
    phone: string,
    email: string,
    address: string,
    city: string,
    zipCode: string,
    birthDate: string,
    wantsCompensation: boolean,
    iban: string,
    bankName: string,
    validated: boolean,
}

export interface UpdateVolunteerRequest {
    firstName: string,
    lastName: string,
    phone: string,
    email: string,
    address: string,
    city: string,
    zipCode: string,
    birthDate: string,
    wantsCompensation: boolean,
    iban: string,
    bankName: string,
}

export const useVolunteers = () => {
    const [volunteers, setVolunteers] = useState<Volunteer[]>([]);

    useEffect(() => {
        const source = axios.CancelToken.source();

        client.get<Volunteer[]>('/volunteers', {
            cancelToken: source.token,
        })
            .then(response => setVolunteers(response.data))
            .catch();

        return () => {
            source.cancel();
        };
    }, []);

    return { volunteers };
};

export const useVolunteer = (uuid: string) => {
    const [volunteer, setVolunteer] = useState<Volunteer>();
    const [dummy, setDummy] = useState({});
    const refresh = () => setDummy({});

    useEffect(() => {
        const source = axios.CancelToken.source();

        client.get<Volunteer>(`volunteers/${uuid}`, {
            cancelToken: source.token,
        })
            .then(response => setVolunteer(response.data))
            .catch();

        return () => {
            source.cancel();
        };
    }, [uuid, dummy]);

    return { volunteer, refresh };
};

function updateVolunteer(uuid: string, volunteer: UpdateVolunteerRequest) {
    return client.put<void>(`/volunteers/${uuid}`, volunteer);
}

function deleteVolunteer(uuid: string) {
    return client.delete<void>(`/volunteers/${uuid}`);
}

function validateVolunteer(uuid: string) {
    return client.post<void>(`/volunteers/${uuid}/validate`);
}

export const volunteerAPI = {
    update: updateVolunteer,
    delete: deleteVolunteer,
    validate: validateVolunteer,
};
