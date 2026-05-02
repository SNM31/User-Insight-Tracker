import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { getFeedContent, ContentItem, timeAgo } from '../services/contentService';
import { trackEvent, EventType } from '../utils/tracker';
import { useAuthContext } from '../context/AuthContext';
import { getTokenPayload } from '../utils/tokenUtils';

const CATEGORIES = [
  { label: 'For You', value: '', emoji: '✨' },
  { label: 'News', value: 'news', emoji: '📰' },
  { label: 'Sports', value: 'sports', emoji: '⚽' },
  { label: 'Movies', value: 'movies', emoji: '🎬' },
  { label: 'Food', value: 'food', emoji: '🍽️' },
];

const categoryColors: Record<string, string> = {
  news: 'bg-blue-100 text-blue-700',
  sports: 'bg-green-100 text-green-700',
  movies: 'bg-purple-100 text-purple-700',
  food: 'bg-orange-100 text-orange-700',
};

const FeedCard: React.FC<{ item: ContentItem; onClick: () => void; featured?: boolean }> = ({
  item,
  onClick,
  featured,
}) => {
  const colorClass = categoryColors[item.category] || 'bg-gray-100 text-gray-700';

  if (featured) {
    return (
      <button
        onClick={onClick}
        className="group w-full text-left rounded-2xl overflow-hidden bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
      >
        <div className="relative h-56 sm:h-72 overflow-hidden">
          <img
            src={item.imageUrl}
            alt={item.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={e => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&q=80'; }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
          <div className="absolute bottom-4 left-4 right-4">
            <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold ${colorClass} mb-2`}>
              {item.category.charAt(0).toUpperCase() + item.category.slice(1)}
            </span>
            <h2 className="text-white font-bold text-lg sm:text-xl leading-tight line-clamp-2">
              {item.title}
            </h2>
          </div>
        </div>
        <div className="p-4">
          <p className="text-gray-500 text-sm leading-relaxed line-clamp-2">{item.description}</p>
          <div className="flex items-center gap-3 mt-3 text-xs text-gray-400">
            <span className="font-medium text-gray-500">{item.source}</span>
            <span>·</span>
            <span>{timeAgo(item.publishedAt)}</span>
            <span>·</span>
            <span>{item.readTime}</span>
          </div>
        </div>
      </button>
    );
  }

  return (
    <button
      onClick={onClick}
      className="group w-full text-left flex gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100"
    >
      <div className="flex-shrink-0 w-24 h-20 rounded-xl overflow-hidden bg-gray-100">
        <img
          src={item.imageUrl}
          alt={item.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={e => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&q=80'; }}
        />
      </div>
      <div className="flex-1 min-w-0">
        <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${colorClass} mb-1`}>
          {item.category.charAt(0).toUpperCase() + item.category.slice(1)}
        </span>
        <h3 className="text-sm font-semibold text-gray-900 leading-snug line-clamp-2 mb-1">
          {item.title}
        </h3>
        <div className="flex items-center gap-2 text-xs text-gray-400">
          <span className="font-medium text-gray-500">{item.source}</span>
          <span>·</span>
          <span>{timeAgo(item.publishedAt)}</span>
        </div>
      </div>
    </button>
  );
};

const SkeletonCard: React.FC<{ featured?: boolean }> = ({ featured }) => (
  <div className={`rounded-2xl bg-white border border-gray-100 overflow-hidden animate-pulse ${featured ? '' : 'flex gap-3 p-3'}`}>
    {featured ? (
      <>
        <div className="h-56 bg-gray-200" />
        <div className="p-4 space-y-2">
          <div className="h-4 bg-gray-200 rounded w-3/4" />
          <div className="h-3 bg-gray-200 rounded w-full" />
          <div className="h-3 bg-gray-200 rounded w-2/3" />
        </div>
      </>
    ) : (
      <>
        <div className="flex-shrink-0 w-24 h-20 bg-gray-200 rounded-xl" />
        <div className="flex-1 space-y-2 pt-1">
          <div className="h-3 bg-gray-200 rounded w-1/4" />
          <div className="h-4 bg-gray-200 rounded w-full" />
          <div className="h-3 bg-gray-200 rounded w-2/3" />
        </div>
      </>
    )}
  </div>
);

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { userToken } = useAuthContext();
  const [selectedCategory, setSelectedCategory] = useState('');
  const [feed, setFeed] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const hasMounted = useRef(false);

  const payload = userToken ? getTokenPayload(userToken) : null;
  const username = (payload?.sub as string) || 'there';
  const firstName = username.split('@')[0];

  const greet = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  };

  useEffect(() => {
    if (!hasMounted.current) {
      hasMounted.current = true;
      trackEvent(EventType.PAGE_VIEW, { page: '/home' });
    }
  }, []);

  useEffect(() => {
    setLoading(true);
    getFeedContent(selectedCategory || undefined).then(items => {
      setFeed(items);
      setLoading(false);
    });
  }, [selectedCategory]);

  const handleCardClick = (item: ContentItem) => {
    trackEvent(EventType.CONTENT_CLICK, {
      category: item.category,
      subcategory: item.subcategory,
      contentId: item.id,
      contentTitle: item.title,
    });
    navigate(`/category/${item.category}/${item.subcategory}`);
  };

  const handleCategoryTab = (value: string) => {
    setSelectedCategory(value);
    if (value) {
      trackEvent(EventType.CATEGORY_VIEW, { category: value, subcategory: null });
    }
  };

  const hero = feed[0];
  const rest = feed.slice(1);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-3xl mx-auto px-4 py-6">
        {/* Greeting */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            {greet()}, {firstName} 👋
          </h1>
          <p className="text-gray-500 text-sm mt-1">Here's what's trending today.</p>
        </div>

        {/* Category tabs */}
        <div className="flex gap-2 overflow-x-auto pb-3 mb-6 scrollbar-hide">
          {CATEGORIES.map(cat => (
            <button
              key={cat.value}
              onClick={() => handleCategoryTab(cat.value)}
              className={`flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-colors border ${
                selectedCategory === cat.value
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300 hover:text-gray-900'
              }`}
            >
              <span>{cat.emoji}</span>
              <span>{cat.label}</span>
            </button>
          ))}
        </div>

        {/* Feed */}
        {loading ? (
          <div className="space-y-4">
            <SkeletonCard featured />
            {Array.from({ length: 5 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : (
          <div className="space-y-3">
            {/* Hero card */}
            {hero && (
              <FeedCard item={hero} onClick={() => handleCardClick(hero)} featured />
            )}

            {/* Divider label */}
            {rest.length > 0 && (
              <div className="flex items-center gap-3 py-2">
                <div className="flex-1 h-px bg-gray-200" />
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Latest</span>
                <div className="flex-1 h-px bg-gray-200" />
              </div>
            )}

            {/* Regular cards */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm divide-y divide-gray-50 overflow-hidden">
              {rest.map(item => (
                <FeedCard key={item.id} item={item} onClick={() => handleCardClick(item)} />
              ))}
            </div>

            {feed.length === 0 && (
              <div className="text-center py-16 text-gray-400">
                <p className="text-4xl mb-3">📭</p>
                <p className="font-medium">No content found for this category.</p>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default HomePage;
