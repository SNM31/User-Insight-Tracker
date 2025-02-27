import api from '../api/axios.config';
import { CreateUserActivity } from '../types';

interface UserActivity {
    type: 'CLICK' | 'PAGE_VIEW' | 'SCROLL' | 'IDLE';
    element?: string;
    url: string;
    timestamp: Date;
    scrollDepth?: number;
    idleTime?: number;
}

export const trackUserActivity = async (activity: CreateUserActivity) => {
    try {
        const token = localStorage.getItem('token');
        
        return await api.post('/activity/track', activity, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
    } catch (error) {
        console.error('Failed to track activity:', error);
        throw error;
    }
}; 