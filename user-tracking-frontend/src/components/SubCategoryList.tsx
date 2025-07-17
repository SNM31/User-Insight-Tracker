import React from 'react';
import { Link, useParams } from 'react-router-dom';

// Define the type for individual subcategory
type SubCategory = {
  name: string;
  slug: string;
  image?: string;
};

// Define the props type for SubCategoryList component
type SubCategoryListProps = {
  subcategories: SubCategory[];
};

const SubCategoryList: React.FC<SubCategoryListProps> = ({ subcategories }) => {
  const { category } = useParams();

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Subcategories</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {subcategories.map((sub) => (
          <Link
            to={`/category/${category}/${sub.slug}`}
            key={sub.slug}
            className="block border rounded shadow hover:shadow-lg overflow-hidden"
          >
            <img
              src={sub.image || 'https://via.placeholder.com/300x200'}
              alt={sub.name}
              className="w-full h-40 object-cover"
            />
            <div className="p-4">
              <h3 className="text-lg font-semibold mb-1">{sub.name}</h3>
              <p className="text-sm text-gray-600">Latest in {sub.name}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default SubCategoryList;