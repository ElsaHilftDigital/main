import {restClient} from "../config/utils";

const client = restClient("/api/v1/auth");

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