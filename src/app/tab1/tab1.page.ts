import { Component } from '@angular/core';
import { RecipeService } from '../services/recipe.service';
import { Recipe } from '../models/recipe.model';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  standalone: false,
})
export class Tab1Page {
  recipes: Recipe[] = [];
  filteredRecipes: Recipe[] = [];
  searchTerm: string = '';

  constructor(private recipeService: RecipeService) {}

  ionViewWillEnter() {
    this.recipes = this.recipeService.getRecipes();
    this.filteredRecipes = [...this.recipes];
  }

  filterRecipes() {
    const term = this.searchTerm.toLowerCase().trim();
    if (term === '') {
      this.filteredRecipes = [...this.recipes];
    } else {
      this.filteredRecipes = this.recipes.filter(recipe =>
        recipe.name.toLowerCase().includes(term) ||
        recipe.description.toLowerCase().includes(term) || 
        recipe.ingredients.some(ingredient => ingredient.toLowerCase().includes(term))
      );
    }
  }

  /*
  openRecipeDetail(recipe: Recipe) {
    console.log(recipe);
  }
  */
}
