import React from 'react';
import { Link } from 'react-router-dom';

// Define the type for individual category
type Category = {
  name: string;
  slug: string;
  image?: string;
};

// Define the props type for CategoryList component
type CategoryListProps = {
  categories: Category[];
};

const CategoryList: React.FC<CategoryListProps> = ({ categories }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-4">
      {categories.map((cat) => (
        <Link
          to={`/category/${cat.slug}`}
          key={cat.slug}
          className="block border rounded overflow-hidden shadow hover:shadow-lg transition duration-200"
        >
          <img
            src={cat.image || 'https://via.placeholder.com/300x200'}
            alt={cat.name}
            className="w-full h-48 object-cover"
          />
          <div className="p-4">
            <h3 className="text-lg font-semibold mb-2">{cat.name}</h3>
            <p className="text-sm text-gray-600">
              Explore {cat.name} articles and updates.
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default CategoryList;