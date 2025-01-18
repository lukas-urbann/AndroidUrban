enum PrepareTime {
  None = 0,
  Low = 1,
  Medium = 2,
  High = 3,
  VeryHigh = 4
}

export interface RecipePhoto {
  imageUrl: string; //tady bude pak bordel
  caption: string;  
}

export interface Recipe {
    id: string;
    name: string;
    description: string;
    ingredients: string[];
    steps: string[];
    isFavorite: boolean;
    createdAt: number;
    tags: string[];
    photos: RecipePhoto[];
  }