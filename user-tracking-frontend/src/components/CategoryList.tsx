import { useNavigate } from 'react-router-dom';
import { categoryData } from '../data/categoryData';

const CategoryList = () => {
  const navigate = useNavigate();

  const handleCategoryClick = (categorySlug: string) => {
    navigate(`/category/${categorySlug}`);
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Select a Category</h2>
      <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {categoryData.map(cat => (
          <li
            key={cat.slug}
            className="border rounded-xl p-2 shadow-md cursor-pointer hover:bg-gray-100"
            onClick={() => handleCategoryClick(cat.slug)}
          >
            <img
              src={cat.image || "https://via.placeholder.com/200x150?text=Category"}
              alt={cat.name}
              className="w-full h-[150px] object-cover rounded-md"
            />
            <p className="mt-2 text-lg font-medium text-center">{cat.name}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CategoryList;
