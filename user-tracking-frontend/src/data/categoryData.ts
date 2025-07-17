export type Category = {
  name: string;
  slug: string;
  image?: string;
  subcategories: SubCategory[];
};

export type SubCategory = {
  name: string;
  slug: string;
  image?: string;
};

export const categoryData: Category[] = [
  {
    name: 'News',
    slug: 'news',
    image: 'https://via.placeholder.com/300x200?text=News',
    subcategories: [
      {
        name: 'Politics',
        slug: 'politics',
        image: 'https://via.placeholder.com/300x200?text=Politics',
      },
      {
        name: 'International',
        slug: 'international',
        image: 'https://via.placeholder.com/300x200?text=International',
      },
    ],
  },
  {
    name: 'Sports',
    slug: 'sports',
    image: 'https://via.placeholder.com/300x200?text=Sports',
    subcategories: [
      {
        name: 'Cricket',
        slug: 'cricket',
        image: 'https://via.placeholder.com/300x200?text=Cricket',
      },
      {
        name: 'Football',
        slug: 'football',
        image: 'https://via.placeholder.com/300x200?text=Football',
      },
    ],
  },
  {
    name: 'Movies',
    slug: 'movies',
    image: 'https://via.placeholder.com/300x200?text=Movies',
    subcategories: [
      {
        name: 'Bollywood',
        slug: 'bollywood',
        image: 'https://via.placeholder.com/300x200?text=Bollywood',
      },
      {
        name: 'Hollywood',
        slug: 'hollywood',
        image: 'https://via.placeholder.com/300x200?text=Hollywood',
      },
    ],
  },
  {
    name: 'Food',
    slug: 'food',
    image: 'https://via.placeholder.com/300x200?text=Food',
    subcategories: [
      {
        name: 'Recipes',
        slug: 'recipes',
        image: 'https://via.placeholder.com/300x200?text=Recipes',
      },
      {
        name: 'Restaurants',
        slug: 'restaurants',
        image: 'https://via.placeholder.com/300x200?text=Restaurants',
      },
    ],
  },
];