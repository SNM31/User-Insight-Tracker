export interface AuthRequest {
    username: string;
    password: string;
}

export interface AuthResponse {
    token: string;
    username: string;
    message: string;
    statusCode: number;
    cookie?: string;
}

export interface LocationData {
    country: string;
    city: string;
}

// Enum for activity types to ensure type safety
export enum ActivityType {
    CLICK = 'click',
    FORM_SUBMISSION = 'form_submission',
    BACKGROUND_TIME = 'background_time',
    LOCATION = 'location',
    SCROLL = 'scroll',
    PAGE_VIEW = 'page_view',
    IDLE = 'idle'
}

export interface UserActivity {
    userId: number;                     // ID of the user
    sessionId: string;                  // Unique session identifier
    type: ActivityType;                 // Type of activity (using enum for type safety)
    element?: string;                   // The HTML element that was interacted with (for clicks)
    formId?: string;                    // The ID of the form (for submissions)
    timestamp: string;                  // When the interaction occurred
    url: string;                        // The URL of the page where the interaction happened
    duration?: number;                  // Duration for background time tracking
    scrollDepth?: number;               // Maximum scroll depth reached
    activeTime?: number;                // Active time spent on page
    idleTime?: number;                  // Idle time spent without interaction
    locationCountry?: string;           // Country from which the user is accessing
    locationCity?: string;              // City from which the user is accessing
}

export interface BaseActivity {
    type: ActivityType;
    url: string;
}

export type CreateUserActivity = Omit<UserActivity, 'timestamp'> & {
    timestamp?: string;
};
