import api from '../api/axios.config';
import { CookieUtils } from '../utils/cookieUtils';
import { UserActivity } from '../types';

class ActivityService {
    private activities: UserActivity[] = [];
    private lastActivityTime: number = Date.now();
    private activeTime: number = 0;
    private idleTime: number = 0;
    private intervalId: NodeJS.Timer | null = null;
    private readonly IDLE_THRESHOLD = 60000; // 1 minute
    private readonly SEND_INTERVAL = 300000; // 5 minutes

    constructor() {
        this.setupEventListeners();
        this.startTracking();
    }

    private setupEventListeners() {
        document.addEventListener('click', this.handleClick);
        document.addEventListener('scroll', this.handleScroll);
        document.addEventListener('mousemove', this.updateLastActivityTime);
        document.addEventListener('keypress', this.updateLastActivityTime);
    }

    private handleClick = (event: MouseEvent) => {
        const target = event.target as HTMLElement;
        this.trackActivity({
            type: 'click',
            element: target.tagName,
            url: window.location.href
        });
    };

    private handleScroll = () => {
        const scrollDepth = Math.round(
            (window.scrollY + window.innerHeight) / document.documentElement.scrollHeight * 100
        );
        this.trackActivity({
            type: 'scroll',
            scrollDepth,
            url: window.location.href
        });
    };

    private updateLastActivityTime = () => {
        this.lastActivityTime = Date.now();
    };

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
        });
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
        document.removeEventListener('click', this.handleClick);
        document.removeEventListener('scroll', this.handleScroll);
        document.removeEventListener('mousemove', this.updateLastActivityTime);
        document.removeEventListener('keypress', this.updateLastActivityTime);
    }
}

export default ActivityService;