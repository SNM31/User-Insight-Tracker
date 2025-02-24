import api from '../api/axios.config';
import { CookieUtils } from '../utilities/cookieUtils';
import { UserActivity, ActivityType } from '../types';

class ActivityService {
    private activities: UserActivity[] = [];
    private lastActivityTime: number = Date.now();
    private activeTime: number = 0;
    private idleTime: number = 0;
    private intervalId: NodeJS.Timer | null = null;
    private readonly IDLE_THRESHOLD = 60000; // 1 minute
    private readonly SEND_INTERVAL = 300000; // 5 minutes

    // Store bound event handlers
    private boundHandleClick: (event: MouseEvent) => void;
    private boundHandleScroll: () => void;
    private boundUpdateLastActivityTime: () => void;

    constructor() {
        // Bind event handlers once in constructor
        this.boundHandleClick = this.handleClick.bind(this);
        this.boundHandleScroll = this.handleScroll.bind(this);
        this.boundUpdateLastActivityTime = this.updateLastActivityTime.bind(this);

        this.setupEventListeners();
        this.startTracking();
        // Track initial page view
        this.trackActivity({
            type: ActivityType.PAGE_VIEW,
            url: window.location.href
        });
    }

    private setupEventListeners() {
        document.addEventListener('click', this.boundHandleClick);
        document.addEventListener('scroll', this.boundHandleScroll);
        document.addEventListener('mousemove', this.boundUpdateLastActivityTime);
        document.addEventListener('keypress', this.boundUpdateLastActivityTime);
    }

    private handleClick(event: MouseEvent) {
        const target = event.target as HTMLElement;
        this.trackActivity({
            type: ActivityType.CLICK,
            element: target.tagName,
            url: window.location.href
        });
    }

    private handleScroll() {
        const scrollDepth = Math.round(
            (window.scrollY + window.innerHeight) / document.documentElement.scrollHeight * 100
        );
        this.trackActivity({
            type: ActivityType.SCROLL,
            scrollDepth,
            url: window.location.href
        });
    }

    private updateLastActivityTime() {
        this.lastActivityTime = Date.now();
    }

    private trackActivity(activity: Partial<UserActivity>) {
        const sessionId = CookieUtils.getSessionId();
        if (!sessionId) {
            return;
        }

        this.activities.push({
            userId: parseInt(localStorage.getItem('userId') || '0'),
            sessionId,
            timestamp: new Date().toISOString(),
            ...activity
        } as UserActivity);
    }

    private updateTimes() {
        const now = Date.now();
        const timeSinceLastActivity = now - this.lastActivityTime;

        if (timeSinceLastActivity < this.IDLE_THRESHOLD) {
            this.activeTime += timeSinceLastActivity;
        } else {
            this.idleTime += timeSinceLastActivity;
        }

        this.lastActivityTime = now;
    }

    private async sendActivities() {
        if (this.activities.length > 0) {
            try {
                await api.post('/user-activity', this.activities);
                this.activities = [];
            } catch (error) {
                console.error('Failed to send activities:', error);
            }
        }
    }

    private startTracking() {
        this.intervalId = setInterval(() => {
            this.updateTimes();
            this.sendActivities();
        }, this.SEND_INTERVAL);
    }

    public cleanup() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
        }
        document.removeEventListener('click', this.boundHandleClick);
        document.removeEventListener('scroll', this.boundHandleScroll);
        document.removeEventListener('mousemove', this.boundUpdateLastActivityTime);
        document.removeEventListener('keypress', this.boundUpdateLastActivityTime);
    }

    public trackPageView(url: string) {
        this.trackActivity({
            type: ActivityType.PAGE_VIEW,
            url
        });
    }
}

export default ActivityService;