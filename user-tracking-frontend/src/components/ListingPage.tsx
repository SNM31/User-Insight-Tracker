import { useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { categoryData } from '../data/categoryData';
import { trackEvent, EventType } from '../utils/tracker';

const ListingPage = () => {
  const { category, sub } = useParams();
  const startTimeRef = useRef<number | null>(null);

  const currentCategory = categoryData.find(cat => cat.slug === category);
  const currentSubCategory = currentCategory?.subcategories.find(subcat => subcat.slug === sub);

  useEffect(() => {
    // Start session timer
    startTimeRef.current = Date.now();

    return () => {
      if (startTimeRef.current !== null) {
        const timeSpent = Math.floor((Date.now() - startTimeRef.current) / 1000);
        if (timeSpent > 0) {
          trackEvent(EventType.TIME_SPENT_ON_SUBCATEGORY, {
            category,
            subcategory: sub,
            timeSpent,
            timestamp: new Date().toISOString(),
          });
        }
      }
    };
  }, [category, sub]);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">{currentSubCategory?.name} Articles</h2>
      <p className="text-gray-700 mb-4">{currentSubCategory?.description}</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[1, 2, 3].map(id => (
          <div key={id} className="border p-4 rounded shadow">
            <h3 className="text-xl font-semibold mb-2">Fake Article {id}</h3>
            <p className="text-sm text-gray-600">
              This is a placeholder for an article about {currentSubCategory?.name}.
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ListingPage;
