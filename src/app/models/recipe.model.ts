export enum PrepareTime {
  None = 'Není určeno',
  Short = 'Krátká (do 30 minut)',
  Medium = 'Střední (30-60 minut)',
  Long = 'Dlouhá (1-2 hodiny)',
  VeryLong = 'Velmi dlouhá (více než 2 hodiny)',
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
    prepareTime: PrepareTime;
    photos: RecipePhoto[];
    defaultPortions: number;
  }