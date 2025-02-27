import api from "../api/axios.config";
import { AuthRequest, AuthResponse } from "../types";

export const authService = {
    async login(credentials: AuthRequest): Promise<AuthResponse> {
        try {
            // Ensure credentials are properly formatted
            const loginPayload = {
                username: credentials.username.trim(),
                password: credentials.password
            };

            console.log('Sending login request:', {
                ...loginPayload,
                password: '[REDACTED]'
            });

            const response = await api.post<AuthResponse>('/auth/login', loginPayload, {
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            });

            console.log('Login response:', {
                status: response.status,
                headers: response.headers,
                data: {
                    ...response.data,
                    token: response.data.token ? '[PRESENT]' : '[MISSING]'
                }
            });

            // Store both token and username if available
            if (response.data.token) {
                localStorage.setItem('token', response.data.token);
                api.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
            }

            if (response.data.username) {
                localStorage.setItem('username', response.data.username);
            }

            return response.data;
        } catch (error: any) {
            console.error('Login error:', {
                message: error.message,
                response: error.response?.data,
                status: error.response?.status
            });
            
            if (error.response?.status === 401) {
                throw new Error(error.response.data || 'Authentication failed');
            }
            
            throw new Error(
                error.response?.data?.message || 
                error.response?.data || 
                error.message || 
                'Login Failed'
            );
        }
    },
    async register(credentials: AuthRequest): Promise<void> {
        try {
            await api.post('/auth/register', credentials, {
                withCredentials: true
            });
        } catch (error: any) {
            throw new Error(error.response?.data?.message || 'Registration Failed');
        }
    },
    logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        delete api.defaults.headers.common['Authorization'];
    }
};