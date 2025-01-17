import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { Recipe } from '../models/recipe.model';

@Injectable({
  providedIn: 'root',
})
export class RecipeService {
  private recipes: Recipe[] = [];

  constructor(private storage: Storage) {
    this.init();
  }

  async init() {
    await this.storage.create(); // Inicializace úložiště
    const storedRecipes = await this.storage.get('recipes');
    this.recipes = storedRecipes ? JSON.parse(storedRecipes) : [];
  }

  getRecipes(): Recipe[] {
    return [...this.recipes]; // Vrací kopii seznamu receptů
  }

  getRecipe(id: string): Recipe | undefined {
    return this.recipes.find(recipe => recipe.id === id);
  }

  async addRecipe(recipe: Recipe) {
    this.recipes.push(recipe);
    await this.storage.set('recipes', JSON.stringify(this.recipes)); // Uloží do úložiště
  }

  async updateRecipe(updatedRecipe: Recipe) {
    const index = this.recipes.findIndex(r => r.id === updatedRecipe.id);
    if (index !== -1) {
      this.recipes[index] = updatedRecipe;
      await this.storage.set('recipes', JSON.stringify(this.recipes));
    }
  }

  async deleteRecipe(id: string) {
    this.recipes = this.recipes.filter(recipe => recipe.id !== id);
    await this.storage.set('recipes', JSON.stringify(this.recipes));
  }
}
