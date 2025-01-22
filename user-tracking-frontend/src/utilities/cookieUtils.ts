import Cookies from 'js-cookie';

export const CookieUtils = {
    getSessionId(): string | undefined {
        return Cookies.get('sessionId');
    },

    setSessionId(sessionId: string): void {
        Cookies.set('sessionId', sessionId, {
            expires: 1, // 1 day
            secure: true,
            sameSite: 'strict',
            path: '/'
        });
    },

    removeSessionId(): void {
        Cookies.remove('sessionId');
    }
};