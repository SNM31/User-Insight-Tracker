// src/data/categoryData.ts

export interface SubCategory {
  name: string;
  description?: string;
}

export interface Category {
  name: string;
  subcategories: SubCategory[];
}

export const categories: Category[] = [
  {
    name: "News",
    subcategories: [
      { name: "Political", description: "Latest political updates" },
      { name: "Domestic", description: "News from around the country" },
      { name: "International", description: "World news highlights" },
    ],
  },
  {
    name: "Sports",
    subcategories: [
      { name: "Cricket", description: "Cricket match updates and analysis" },
      { name: "Football", description: "Football leagues and scores" },
      { name: "Olympics", description: "Olympic games news" },
    ],
  },
  {
    name: "Movies",
    subcategories: [
      { name: "Bollywood", description: "Latest Bollywood releases" },
      { name: "Hollywood", description: "Hollywood blockbusters and news" },
      { name: "Documentaries", description: "Informative and engaging docs" },
    ],
  },
  {
    name: "Food",
    subcategories: [
      { name: "Indian", description: "Spicy and flavorful Indian cuisine" },
      { name: "Continental", description: "Continental dishes and trends" },
      { name: "Desserts", description: "Sweets and dessert ideas" },
    ],
  },
];
