import { Component  } from '@angular/core';
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
    this.filterRecipes();
    console.log("ahojda");
  }

  filterRecipes() {
    this.updateFilteredRecipes();
  }

  toggleFavorite(recipe: Recipe, event: Event) {
    event.stopPropagation(); // Tohle by mělo zabránit překlikávání na detail, nevím
    recipe.isFavorite = !recipe.isFavorite;
    this.recipeService.updateRecipe(recipe);
    this.updateFilteredRecipes();
  }

  private updateFilteredRecipes() {
    const term = this.searchTerm.toLowerCase().trim();

    const filtered = this.recipes.filter(recipe =>
      recipe.name.toLowerCase().includes(term) ||
      recipe.description.toLowerCase().includes(term)|| 
      recipe.ingredients.some(ingredient => ingredient.toLowerCase().includes(term))
    );

    //jen porovnávání s oblíbenými recepty
    this.filteredRecipes = filtered.sort((a, b) => {
      if (a.isFavorite !== b.isFavorite) {
        return a.isFavorite ? -1 : 1; // Oblíbené recepty nahoře
      }
      return b.createdAt - a.createdAt; // Nejnovější recepty nahoře
    });
  }

  /*
  openRecipeDetail(recipe: Recipe) {
    console.log(recipe);
  }
  */
}
