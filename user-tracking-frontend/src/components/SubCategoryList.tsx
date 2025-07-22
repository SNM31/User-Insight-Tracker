import { useParams, useNavigate } from 'react-router-dom';
import { categoryData } from '../data/categoryData';
import { trackEvent, EventType } from '../utils/tracker';
import { useEffect, useRef } from 'react';

const SubCategoryList = () => {
  const { category } = useParams();
  const navigate = useNavigate();

  const currentCategory = categoryData.find(cat => cat.slug === category);
  const subcategories = currentCategory?.subcategories || [];

  // ✅ Track CATEGORY_VIEW on mount with subcategory=null
  const hasTrackedCategoryView = useRef(false);
  useEffect(() => {
    if (category && !hasTrackedCategoryView.current) {
      hasTrackedCategoryView.current = true;
      trackEvent(EventType.CATEGORY_VIEW, {
        category,
        subcategory: null, // explicitly set subcategory to null
      });
    }
  }, [category]);

  // ❌ Removed: automatic SUBCATEGORY_VIEW loop

  // ✅ Track SUBCATEGORY_VIEW & CONTENT_OPENED only on user click
  const openedSetRef = useRef<Set<string>>(new Set());

  const handleSubcategoryClick = (subSlug: string) => {
    // SUBCATEGORY_VIEW (once per subcategory)
    if (!openedSetRef.current.has(subSlug)) {
      openedSetRef.current.add(subSlug);

      trackEvent(EventType.SUBCATEGORY_VIEW, {
        category,
        subcategory: subSlug,
      });

      trackEvent(EventType.CONTENT_OPENED, {
        category,
        subcategory: subSlug,
      });
    }

    navigate(`/category/${category}/${subSlug}`);
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Subcategories for {category}</h2>
      <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {subcategories.map(sub => (
          <li
            key={sub.slug}
            className="border rounded-xl p-2 shadow-md cursor-pointer hover:bg-gray-100"
            onClick={() => handleSubcategoryClick(sub.slug)}
          >
            <img
              src={sub.image || "https://via.placeholder.com/200x150?text=Image"}
              alt={sub.name}
              className="w-full h-[150px] object-cover rounded-md"
            />
            <p className="mt-2 text-lg font-medium">{sub.name}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SubCategoryList;
