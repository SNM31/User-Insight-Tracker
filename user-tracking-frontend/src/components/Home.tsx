import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { trackUserActivity } from '../services/activityService';
import { ActivityType } from '../types';

export const Home: React.FC = () => {
    const { username } = useAuth();
    const navigate = useNavigate();

    // Track page view
    useEffect(() => {
        trackUserActivity({
            type: ActivityType.PAGE_VIEW,
            url: window.location.pathname,
            timestamp: new Date().toISOString(),
            userId: 1,
            sessionId: 'temp-session'
        });
    }, []);

    // Categories of interest 
    const categories = [
        {
            id: 1,
            title: "Technology",
            description: "Latest tech news and gadgets",
            image: "/images/tech.jpg",
            links: [
                { title: "AI News", url: "/tech/ai" },
                { title: "New Gadgets", url: "/tech/gadgets" },
                { title: "Programming", url: "/tech/programming" }
            ]
        },
        {
            id: 2,
            title: "Sports",
            description: "Sports updates and highlights",
            image: "/images/sports.jpg",
            links: [
                { title: "Football", url: "/sports/football" },
                { title: "Basketball", url: "/sports/basketball" },
                { title: "Tennis", url: "/sports/tennis" }
            ]
        },
        {
            id: 3,
            title: "Entertainment",
            description: "Movies, music, and more",
            image: "/images/entertainment.jpg",
            links: [
                { title: "Movies", url: "/entertainment/movies" },
                { title: "Music", url: "/entertainment/music" },
                { title: "TV Shows", url: "/entertainment/tv" }
            ]
        }
    ];

    const handleClick = (category: string, link: string) => {
        // Track click activity
        trackUserActivity({
            type: ActivityType.CLICK,
            element: `${category}-${link}`,
            url: window.location.pathname,
            timestamp: new Date().toISOString(),
            userId: 1,
            sessionId: 'temp-session'
        });
        
        // Navigate to the link
        navigate(link);
    };

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Welcome Section */}
            <header className="bg-white shadow">
                <div className="max-w-7xl mx-auto py-6 px-4">
                    <h1 className="text-3xl font-bold text-gray-900">
                        Welcome back, {username}!
                    </h1>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                {/* Categories Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {categories.map((category) => (
                        <div 
                            key={category.id}
                            className="bg-white overflow-hidden shadow rounded-lg"
                        >
                            <img 
                                src={category.image} 
                                alt={category.title}
                                className="w-full h-48 object-cover"
                            />
                            <div className="p-6">
                                <h3 className="text-xl font-semibold text-gray-900">
                                    {category.title}
                                </h3>
                                <p className="mt-2 text-gray-600">
                                    {category.description}
                                </p>
                                <div className="mt-4 space-y-2">
                                    {category.links.map((link) => (
                                        <button
                                            key={link.title}
                                            onClick={() => handleClick(category.title, link.url)}
                                            className="block w-full text-left px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded"
                                        >
                                            {link.title}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Advertisement Section */}
                <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div 
                        onClick={() => handleClick('Ad', '/promo/spring-sale')}
                        className="bg-gradient-to-r from-purple-500 to-indigo-600 rounded-lg shadow-lg p-6 cursor-pointer"
                    >
                        <h3 className="text-xl font-bold text-white">Spring Sale!</h3>
                        <p className="mt-2 text-white">Get up to 50% off on selected items</p>
                    </div>
                    <div 
                        onClick={() => handleClick('Ad', '/promo/new-arrival')}
                        className="bg-gradient-to-r from-pink-500 to-red-600 rounded-lg shadow-lg p-6 cursor-pointer"
                    >
                        <h3 className="text-xl font-bold text-white">New Arrivals</h3>
                        <p className="mt-2 text-white">Check out our latest collection</p>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Home; 