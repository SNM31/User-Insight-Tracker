import { useEffect } from 'react';

export const useActivityTracking = (page: string) => {
    useEffect(() => {
        // Log user activity when component mounts
        console.log(`User visited ${page} page`);
        
        return () => {
            // Cleanup when component unmounts
            console.log(`User left ${page} page`);
        };
    }, [page]);
}; 