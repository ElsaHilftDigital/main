import axios from 'axios';

const client = axios.create({ baseURL: `/api/v1/auth`});

export interface LoginRequest {
    username: string,
    password: string
}

export interface PasswordChangeRequest {
    oldPassword: string,
    newPassword: string
}

export function login(auth: LoginRequest) {
    return client.post(`/login`, auth);
}

export function changePassword(update: PasswordChangeRequest) {
    return client.post(`/change-password`, update);
}