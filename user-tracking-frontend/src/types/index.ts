export interface AuthRequest {
    username: string;
    password: string;
}

export interface AuthResponse {
    token: string;
    username: string;
    message: string;
    statusCode: number;
}

export interface LocationData {
    country: string;
    city: string;
}