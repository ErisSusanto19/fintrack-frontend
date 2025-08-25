import { User } from ".";

export interface AuthLoginPayload {
    email: string;
    password: string;
}

export interface AuthLoginSuccessPayload {
    accessToken: string;
    refreshToken: string;
    user: User
}

export interface AuthRegisterPayload {
    fullName: string;
    email: string;
    password: string;
}

export interface AuthRegisterSuccessPayload {
    accessToken: string;
    refreshToken: string;
    user: User
}

export interface AuthLogoutPayload {
    refreshToken: string;
}