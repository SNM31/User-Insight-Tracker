import { useState, useEffect } from "react";
import axios from "axios";
import { LocationData, ActivityType, UserActivity } from "../types";
import { CookieUtils } from "../utilities/cookieUtils";

export const useLocation = () => {
    const [location, setLocation] = useState<LocationData>({
        country: '',
        city: ''
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>();

    useEffect(() => {
        const fetchLocation = async () => {
            try {
                const response = await axios.get<{country_name: string, city: string}>('https://ipapi.co/json/');
                const locationData = {
                    country: response.data.country_name,
                    city: response.data.city
                };
                setLocation(locationData);
                
                // Track location data
                const sessionId = CookieUtils.getSessionId();
                if (sessionId) {
                    const activity: Partial<UserActivity> = {
                        type: ActivityType.LOCATION,
                        locationCountry: locationData.country,
                        locationCity: locationData.city,
                        url: window.location.href
                    };
                }
            } catch (error) {
                setError('Failed to fetch location');
                setLocation({ country: 'Unknown', city: 'Unknown' });
            } finally {
                setLoading(false);
            }
        };
        fetchLocation();
    }, []);

    return { location, loading, error };
};