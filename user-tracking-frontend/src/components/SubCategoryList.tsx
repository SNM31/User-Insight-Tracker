import React, { useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from './Header';
import { categoryData } from '../data/categoryData';
import { trackEvent, EventType } from '../utils/tracker';

const categoryColors: Record<string, { bg: string; text: string; border: string }> = {
  news: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-100' },
  sports: { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-100' },
  movies: { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-100' },
  food: { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-100' },
};

const categoryEmojis: Record<string, string> = {
  news: '📰',
  sports: '⚽',
  movies: '🎬',
  food: '🍽️',
};

const subcategoryImages: Record<string, string> = {
  political: 'https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=600&q=80',
  domestic: 'https://images.unsplash.com/photo-1545568014-8692077e9b5c?w=600&q=80',
  international: 'https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?w=600&q=80',
  cricket: 'https://images.unsplash.com/photo-1540747913346-19212a4b423e?w=600&q=80',
  football: 'https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=600&q=80',
  olympics: 'https://images.unsplash.com/photo-1471295253337-3ceaaedca402?w=600&q=80',
  bollywood: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=600&q=80',
  hollywood: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=600&q=80',
  documentaries: 'https://images.unsplash.com/photo-1518020382113-a7e8fc38eac9?w=600&q=80',
  indian: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=600&q=80',
  continental: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&q=80',
  desserts: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=600&q=80',
};

const SubCategoryList: React.FC = () => {
  const { category } = useParams<{ category: string }>();
  const navigate = useNavigate();

  const currentCategory = categoryData.find(cat => cat.slug === category);
  const subcategories = currentCategory?.subcategories || [];
  const colors = categoryColors[category || ''] || categoryColors.news;
  const emoji = categoryEmojis[category || ''] || '📄';

  const hasTrackedCategoryView = useRef(false);
  const openedSetRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    if (category && !hasTrackedCategoryView.current) {
      hasTrackedCategoryView.current = true;
      trackEvent(EventType.CATEGORY_VIEW, { category, subcategory: null });
      trackEvent(EventType.PAGE_VIEW, { page: `/category/${category}` });
    }
  }, [category]);

  const handleSubcategoryClick = (subSlug: string) => {
    if (!openedSetRef.current.has(subSlug)) {
      openedSetRef.current.add(subSlug);
      trackEvent(EventType.SUBCATEGORY_VIEW, { category, subcategory: subSlug });
      trackEvent(EventType.CONTENT_OPENED, { category, subcategory: subSlug });
    }
    navigate(`/category/${category}/${subSlug}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-4xl mx-auto px-4 py-6">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-400 mb-6">
          <button onClick={() => navigate('/home')} className="hover:text-indigo-600 transition-colors font-medium">
            Home
          </button>
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          <span className="text-gray-700 font-semibold capitalize">{category}</span>
        </nav>

        {/* Category header */}
        <div className={`flex items-center gap-4 p-5 rounded-2xl ${colors.bg} border ${colors.border} mb-8`}>
          <div className="text-4xl">{emoji}</div>
          <div>
            <h1 className={`text-2xl font-bold capitalize ${colors.text}`}>
              {currentCategory?.name || category}
            </h1>
            <p className="text-gray-500 text-sm mt-0.5">
              {subcategories.length} topics to explore
            </p>
          </div>
        </div>

        {/* Subcategory grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {subcategories.map(sub => {
            const imageUrl = subcategoryImages[sub.slug] || sub.image ||
              `https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=600&q=80`;

            return (
              <button
                key={sub.slug}
                onClick={() => handleSubcategoryClick(sub.slug)}
                className="group text-left rounded-2xl overflow-hidden bg-white border border-gray-100 shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5"
              >
                <div className="relative h-44 overflow-hidden">
                  <img
                    src={imageUrl}
                    alt={sub.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={e => {
                      (e.target as HTMLImageElement).src =
                        'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=600&q=80';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 text-base mb-1">{sub.name}</h3>
                  <p className="text-gray-400 text-xs leading-relaxed line-clamp-2">
                    {sub.description || `Explore the latest in ${sub.name}`}
                  </p>
                  <div className={`inline-flex items-center gap-1 mt-3 text-xs font-semibold ${colors.text}`}>
                    Browse articles
                    <svg className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </main>
    </div>
  );
};

export default SubCategoryList;
