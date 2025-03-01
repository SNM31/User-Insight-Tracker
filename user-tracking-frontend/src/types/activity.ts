export enum ActivityType {
    CLICK = 'CLICK',
    FORM_SUBMISSION = 'FORM_SUBMISSION',
    BACKGROUND_TIME = 'BACKGROUND_TIME',
    LOCATION = 'LOCATION',
    SCROLL = 'SCROLL',
    PAGE_VIEW = 'PAGE_VIEW',
    IDLE = 'IDLE'
}

export interface UserActivity {
    userId?: number;
    sessionId: string;
    type: ActivityType;
    element?: string;
    formId?: string;
    timestamp: string;
    url: string;
    scrollDepth?: number;
    activeTime?: number;
    idleTime?: number;
    locationCountry?: string;
    locationCity?: string;
}

export interface LocationData {
    country: string;
    city: string;
} 