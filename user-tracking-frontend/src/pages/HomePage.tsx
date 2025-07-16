import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';

const categories = [
  { name: 'News', subcategories: ['Political', 'Domestic', 'International'] },
  { name: 'Sports', subcategories: ['Cricket', 'Basketball', 'Tennis'] },
  { name: 'Movies', subcategories: ['Action', 'Drama', 'Comedy'] },
  { name: 'Food', subcategories: ['Indian', 'Chinese', 'Italian'] },
];

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  const handleCategoryClick = (category: string) => {
    navigate(`/category/${category.toLowerCase()}`);
  };

  return (
    <>
    <Header />
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Explore Categories</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {categories.map((cat) => (
          <div
            key={cat.name}
            className="bg-blue-100 p-4 rounded shadow cursor-pointer hover:bg-blue-200 transition"
            onClick={() => handleCategoryClick(cat.name)}
          >
            <h2 className="text-xl font-semibold text-center">{cat.name}</h2>
          </div>
        ))}
      </div>
    </div>
    </>
  );
};

export default HomePage;
