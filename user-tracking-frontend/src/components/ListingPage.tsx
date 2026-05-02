import React, { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from './Header';
import { categoryData } from '../data/categoryData';
import { getContent, ContentItem, timeAgo } from '../services/contentService';
import { trackEvent, EventType } from '../utils/tracker';

const categoryColors: Record<string, { bg: string; text: string; pill: string }> = {
  news: { bg: 'bg-blue-50', text: 'text-blue-700', pill: 'bg-blue-100 text-blue-700' },
  sports: { bg: 'bg-green-50', text: 'text-green-700', pill: 'bg-green-100 text-green-700' },
  movies: { bg: 'bg-purple-50', text: 'text-purple-700', pill: 'bg-purple-100 text-purple-700' },
  food: { bg: 'bg-orange-50', text: 'text-orange-700', pill: 'bg-orange-100 text-orange-700' },
};

const ArticleCard: React.FC<{
  item: ContentItem;
  featured?: boolean;
  onClickCard: (item: ContentItem) => void;
}> = ({ item, featured, onClickCard }) => {
  const colors = categoryColors[item.category] || categoryColors.news;

  if (featured) {
    return (
      <button
        onClick={() => onClickCard(item)}
        className="group w-full text-left rounded-2xl overflow-hidden bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
      >
        <div className="relative h-64 sm:h-80 overflow-hidden">
          <img
            src={item.imageUrl}
            alt={item.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={e => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&q=80'; }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          <span className={`absolute top-4 left-4 px-2.5 py-0.5 rounded-full text-xs font-semibold ${colors.pill}`}>
            Top Story
          </span>
          <div className="absolute bottom-5 left-5 right-5 text-white">
            <h2 className="font-bold text-xl sm:text-2xl leading-tight mb-2 line-clamp-3">{item.title}</h2>
            <div className="flex items-center gap-2 text-sm text-white/80">
              <span className="font-medium">{item.source}</span>
              <span>·</span>
              <span>{timeAgo(item.publishedAt)}</span>
              <span>·</span>
              <span>{item.readTime}</span>
            </div>
          </div>
        </div>
        <div className="p-5">
          <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">{item.description}</p>
        </div>
      </button>
    );
  }

  return (
    <button
      onClick={() => onClickCard(item)}
      className="group w-full text-left rounded-xl overflow-hidden bg-white border border-gray-100 shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5"
    >
      <div className="relative h-44 overflow-hidden">
        <img
          src={item.imageUrl}
          alt={item.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={e => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&q=80'; }}
        />
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 text-sm leading-snug line-clamp-2 mb-2">{item.title}</h3>
        <p className="text-gray-400 text-xs leading-relaxed line-clamp-2 mb-3">{item.description}</p>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <span className="font-medium text-gray-500">{item.source}</span>
            <span>·</span>
            <span>{timeAgo(item.publishedAt)}</span>
          </div>
          <span className="text-xs text-gray-400">{item.readTime}</span>
        </div>
      </div>
    </button>
  );
};

const SkeletonCard: React.FC<{ featured?: boolean }> = ({ featured }) => (
  <div className={`rounded-2xl bg-white border border-gray-100 overflow-hidden animate-pulse`}>
    <div className={`${featured ? 'h-64' : 'h-44'} bg-gray-200`} />
    <div className="p-4 space-y-2">
      <div className="h-4 bg-gray-200 rounded w-3/4" />
      <div className="h-3 bg-gray-200 rounded" />
      <div className="h-3 bg-gray-200 rounded w-2/3" />
    </div>
  </div>
);

const ListingPage: React.FC = () => {
  const { category, sub } = useParams<{ category: string; sub: string }>();
  const navigate = useNavigate();
  const [articles, setArticles] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const startTimeRef = useRef<number>(Date.now());
  const scrollDepthFired = useRef<Set<number>>(new Set());
  const pageRef = useRef<HTMLDivElement>(null);

  const currentCategory = categoryData.find(c => c.slug === category);
  const currentSub = currentCategory?.subcategories.find(s => s.slug === sub);
  const colors = categoryColors[category || ''] || categoryColors.news;

  // Load content
  useEffect(() => {
    if (!category || !sub) return;
    setLoading(true);
    trackEvent(EventType.PAGE_VIEW, { page: `/category/${category}/${sub}` });
    getContent(category, sub).then(items => {
      setArticles(items);
      setLoading(false);
    });
  }, [category, sub]);

  // Time spent on unmount
  useEffect(() => {
    startTimeRef.current = Date.now();
    return () => {
      const timeSpent = Math.floor((Date.now() - startTimeRef.current) / 1000);
      if (timeSpent > 0) {
        trackEvent(EventType.TIME_SPENT_ON_SUBCATEGORY, {
          category: currentCategory?.name || category,
          subcategory: currentSub?.name || sub,
          duration: timeSpent,
          timestamp: new Date().toISOString(),
        });
      }
    };
  }, [category, sub, currentCategory?.name, currentSub?.name]);

  // Scroll depth tracking
  useEffect(() => {
    const handleScroll = () => {
      const el = pageRef.current;
      if (!el) return;
      const scrolled = window.scrollY + window.innerHeight;
      const total = el.scrollHeight;
      const pct = Math.floor((scrolled / total) * 100);
      const milestones = [25, 50, 75, 100];
      for (const m of milestones) {
        if (pct >= m && !scrollDepthFired.current.has(m)) {
          scrollDepthFired.current.add(m);
          trackEvent(EventType.SCROLL_DEPTH, {
            category,
            subcategory: sub,
            depth: m,
          });
        }
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [category, sub]);

  const handleCardClick = (item: ContentItem) => {
    trackEvent(EventType.CONTENT_CLICK, {
      category: item.category,
      subcategory: item.subcategory,
      contentId: item.id,
      contentTitle: item.title,
      source: item.source,
    });
    if (item.url && item.url !== '#') {
      window.open(item.url, '_blank', 'noopener,noreferrer');
    }
  };

  const hero = articles[0];
  const rest = articles.slice(1);

  return (
    <div className="min-h-screen bg-gray-50" ref={pageRef}>
      <Header />

      <main className="max-w-4xl mx-auto px-4 py-6">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-400 mb-6 flex-wrap">
          <button onClick={() => navigate('/home')} className="hover:text-indigo-600 transition-colors font-medium">
            Home
          </button>
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          <button
            onClick={() => navigate(`/category/${category}`)}
            className="hover:text-indigo-600 transition-colors font-medium capitalize"
          >
            {category}
          </button>
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          <span className={`font-semibold ${colors.text}`}>{currentSub?.name || sub}</span>
        </nav>

        {/* Section header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{currentSub?.name}</h1>
            {!loading && (
              <p className="text-sm text-gray-400 mt-0.5">{articles.length} stories</p>
            )}
          </div>
        </div>

        {loading ? (
          <div className="space-y-4">
            <SkeletonCard featured />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)}
            </div>
          </div>
        ) : articles.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <p className="text-4xl mb-3">📭</p>
            <p className="font-medium">No stories found. Check back soon.</p>
          </div>
        ) : (
          <div className="space-y-5">
            {/* Hero */}
            {hero && (
              <ArticleCard item={hero} featured onClickCard={handleCardClick} />
            )}

            {/* Grid */}
            {rest.length > 0 && (
              <>
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-px bg-gray-200" />
                  <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">More Stories</span>
                  <div className="flex-1 h-px bg-gray-200" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {rest.map(item => (
                    <ArticleCard key={item.id} item={item} onClickCard={handleCardClick} />
                  ))}
                </div>
              </>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default ListingPage;
