export interface Recipe {
    id: string;
    name: string;
    description: string;
    ingredients: string[];
    steps: string[];
    isFavorite: boolean;
    createdAt: number;
    tags: string[];
  }