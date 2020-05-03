import {restClient} from "../config/utils";
import axios from "axios";
import {useEffect, useState} from "react";

const client = restClient('api/v1/admin');

export interface Moderator {
    uuid: string,
    name: string,
    email?: string,
}

export const useModerators = () => {
    const [moderators, setModerators] = useState<Moderator[]>([]);

    useEffect(() => {
        const source = axios.CancelToken.source();
        client.get<Moderator[]>('/moderators', {
            cancelToken: source.token
        })
            .then(response => {
                setModerators(response.data);
            })
            .catch();
        return () => {
            source.cancel();
        }
    }, []);

    return moderators;
};
