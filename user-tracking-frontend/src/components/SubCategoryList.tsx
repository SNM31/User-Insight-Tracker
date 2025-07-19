import { useParams } from 'react-router-dom';
import { categoryData } from '../data/categoryData';
import { trackEvent, EventType } from '../utils/tracker';
import { useEffect } from 'react';

const SubCategoryList = () => {
  const { category } = useParams();

  const currentCategory = categoryData.find(cat => cat.slug === category);
  const subcategories = currentCategory?.subcategories || [];

  useEffect(() => {
    trackEvent(EventType.SUBCATEGORY_VIEW, { category });
  }, [category]);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Subcategories for {category}</h2>
      <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {subcategories.map(sub => (
          <li key={sub.slug} className="border rounded-xl p-2 shadow-md">
            <a href={`/category/${category}/${sub.slug}`}>
              <img
                src={sub.image || "https://via.placeholder.com/200x150?text=Image"}
                alt={sub.name}
                className="w-full h-[150px] object-cover rounded-md"
              />
              <p className="mt-2 text-lg font-medium">{sub.name}</p>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SubCategoryList;