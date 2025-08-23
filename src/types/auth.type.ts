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