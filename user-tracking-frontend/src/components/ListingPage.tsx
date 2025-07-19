import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { categoryData } from '../data/categoryData';
import { trackEvent, EventType } from '../utils/tracker';

const ListingPage = () => {
  const { category, sub } = useParams();
  const [startTime, setStartTime] = useState(Date.now());

  const currentCategory = categoryData.find(cat => cat.slug === category);
  const currentSubCategory = currentCategory?.subcategories.find(subcat => subcat.slug === sub);

  useEffect(() => {
    trackEvent(EventType.CONTENT_OPENED, { category, sub });
    setStartTime(Date.now());

    return () => {
      const timeSpent = Math.floor((Date.now() - startTime) / 1000);
      trackEvent(EventType.TIME_SPENT_ON_SUBCATEGORY, { category, sub, timeSpent });
    };
  }, [category, sub]);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">{currentSubCategory?.name} Articles</h2>
      <p className="text-gray-700 mb-4">{currentSubCategory?.description}</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[1, 2, 3].map((id) => (
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