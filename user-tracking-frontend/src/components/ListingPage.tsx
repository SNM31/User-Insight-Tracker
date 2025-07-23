import { useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { categoryData } from '../data/categoryData';
import { trackEvent, EventType } from '../utils/tracker';

const ListingPage = () => {
  const { category, sub } = useParams();
  const navigate = useNavigate();
  const startTimeRef = useRef<number | null>(null);

  const currentCategory = categoryData.find(cat => cat.slug === category);
  const currentSubCategory = currentCategory?.subcategories.find(subcat => subcat.slug === sub);

  useEffect(() => {
    startTimeRef.current = Date.now();

    return () => {
      if (startTimeRef.current !== null) {
        const timeSpent = Math.floor((Date.now() - startTimeRef.current) / 1000);
        if (timeSpent > 0) {
          trackEvent(EventType.TIME_SPENT_ON_SUBCATEGORY, {
            category: currentCategory?.name || category,
            subcategory: currentSubCategory?.name || sub,
            duration: timeSpent,
            timestamp: new Date().toISOString(), // ✅ ISO string
          });
        }
      }
    };
  }, [category, sub]);

  const goToHome = () => {
    navigate('/home');
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">
          {currentSubCategory?.name} Articles
        </h2>
        <button
          onClick={goToHome}
          className="text-blue-600 hover:underline text-sm"
        >
          ← Back to Home
        </button>
      </div>

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
