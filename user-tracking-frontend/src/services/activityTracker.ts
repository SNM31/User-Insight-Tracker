import api from '../api/axios.config';
import { UserActivity, ActivityType } from '../types/activity';
import { CookieUtils } from '../utilities/cookieUtils';

// Simple class to track user activities
class ActivityTracker {
    // Store activities until we send them
    private activities: UserActivity[] = [];
    
    // Timer to send activities periodically
    private batchTimer: NodeJS.Timeout | null = null;

    constructor() {
        // Start sending activities every 30 seconds
        this.startSendingActivities();
    }

    // Start the timer to send activities
    private startSendingActivities() {
        this.batchTimer = setInterval(() => {
            this.sendActivities();
        }, 30000); // 30 seconds
    }

    // Main method to track any activity
    track(activity: {
        type: ActivityType;
        url?: string;
        element?: string;
        scrollDepth?: number;
        formId?: string;
        locationCountry?: string;
        locationCity?: string;
    }) {
        // Get session ID from cookie
        const sessionId = CookieUtils.getSessionId();
        if (!sessionId) {
            console.log('No session found, not tracking activity');
            return;
        }

        // Create full activity object
        const fullActivity: UserActivity = {
            ...activity,
            sessionId,
            timestamp: new Date().toISOString(),
            url: activity.url || window.location.href
        };

        // Add to list of activities
        this.activities.push(fullActivity);

        // If we have 10 or more activities, send them now
        if (this.activities.length >= 10) {
            this.sendActivities();
        }
    }

    // Send activities to the server
    private async sendActivities() {
        // If no activities, don't do anything
        if (this.activities.length === 0) return;

        try {
            // Get all current activities
            const activitiesToSend = [...this.activities];
            // Clear the list
            this.activities = [];

            // Send to server
            await api.post('/api/send/user-activity', activitiesToSend);
            console.log('Sent activities:', activitiesToSend.length);
        } catch (error) {
            console.log('Failed to send activities:', error);
            // If failed, put activities back in list
            this.activities = [...activitiesToSend, ...this.activities];
        }
    }

    // Clean up when component unmounts
    cleanup() {
        if (this.batchTimer) {
            clearInterval(this.batchTimer);
            // Send any remaining activities
            this.sendActivities();
        }
    }
}

// Create one tracker to use everywhere
export const activityTracker = new ActivityTracker(); 