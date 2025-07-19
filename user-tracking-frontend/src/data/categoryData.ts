export interface SubCategory {
  name: string;
  slug: string;
  image?: string;
  description?: string;
}

export interface Category {
  name: string;
  slug: string;
  image?: string;
  subcategories: SubCategory[];
}

export const categoryData: Category[] = [
  {
    name: "News",
    slug: "news",
    image: "https://picsum.photos/seed/news/300/200",
    subcategories: [
      {
        name: "Political",
        slug: "political",
        image: "https://picsum.photos/seed/political/200/150",
        description: "Latest political updates",
      },
      {
        name: "Domestic",
        slug: "domestic",
        image: "https://picsum.photos/seed/domestic/200/150",
        description: "News from around the country",
      },
      {
        name: "International",
        slug: "international",
        image: "https://picsum.photos/seed/international/200/150",
        description: "World news highlights",
      },
    ],
  },
  {
    name: "Sports",
    slug: "sports",
    image: "https://picsum.photos/seed/sports/300/200",
    subcategories: [
      {
        name: "Cricket",
        slug: "cricket",
        image: "https://picsum.photos/seed/cricket/200/150",
        description: "Cricket match updates and analysis",
      },
      {
        name: "Football",
        slug: "football",
        image: "https://picsum.photos/seed/football/200/150",
        description: "Football leagues and scores",
      },
      {
        name: "Olympics",
        slug: "olympics",
        image: "https://picsum.photos/seed/olympics/200/150",
        description: "Olympic games news",
      },
    ],
  },
  {
    name: "Movies",
    slug: "movies",
    image: "https://picsum.photos/seed/movies/300/200",
    subcategories: [
      {
        name: "Bollywood",
        slug: "bollywood",
        image: "https://picsum.photos/seed/bollywood/200/150",
        description: "Latest Bollywood releases",
      },
      {
        name: "Hollywood",
        slug: "hollywood",
        image: "https://picsum.photos/seed/hollywood/200/150",
        description: "Hollywood blockbusters and news",
      },
      {
        name: "Documentaries",
        slug: "documentaries",
        image: "https://picsum.photos/seed/documentaries/200/150",
        description: "Informative and engaging docs",
      },
    ],
  },
  {
    name: "Food",
    slug: "food",
    image: "https://picsum.photos/seed/food/300/200",
    subcategories: [
      {
        name: "Indian",
        slug: "indian",
        image: "https://picsum.photos/seed/indian/200/150",
        description: "Spicy and flavorful Indian cuisine",
      },
      {
        name: "Continental",
        slug: "continental",
        image: "https://picsum.photos/seed/continental/200/150",
        description: "Continental dishes and trends",
      },
      {
        name: "Desserts",
        slug: "desserts",
        image: "https://picsum.photos/seed/desserts/200/150",
        description: "Sweets and dessert ideas",
      },
    ],
  },
];