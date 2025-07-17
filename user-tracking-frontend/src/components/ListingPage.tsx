import React from 'react';
import { useParams } from 'react-router-dom';

const ListingPage = () => {
  const { category, sub } = useParams();

  // Example fake data
  const listings = Array.from({ length: 6 }).map((_, i) => ({
    title: `Article ${i + 1}`,
    description: `This is a short description for article ${i + 1} under ${sub}.`,
    image: 'https://via.placeholder.com/600x400',
  }));

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">
        Articles in {sub} ({category})
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {listings.map((item, idx) => (
          <div
            key={idx}
            className="border rounded shadow hover:shadow-lg overflow-hidden"
          >
            <img
              src={item.image}
              alt={item.title}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
              <p className="text-sm text-gray-600">{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ListingPage;