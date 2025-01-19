import { Component } from '@angular/core';
import { RecipeService } from '../services/recipe.service';
import { Recipe, PrepareTime } from '../models/recipe.model';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  standalone: false,
})
export class Tab2Page {
  recipeCount = this.recipeService.getRecipes().length;
  tags: string[] = [];
  selectedTags: string[] = [];
  filteredRecipes: Recipe[] = [];

  constructor(private recipeService: RecipeService) {}

  ionViewWillEnter() {
    this.recipeCount = this.recipeService.getRecipes().length;
    const recipes = this.recipeService.getRecipes();

    const specialTags = [
      'Oblíbené',
      ...Object.values(PrepareTime), // Přidání časů přípravy jako tagy
    ];

    const recipeTags = Array.from(new Set(recipes.flatMap(recipe => recipe.tags)));

    const index = this.tags.indexOf(''); //ať tam není prázdný tag
    if (index !== -1) {
      this.tags.splice(index, 1);
    }

    this.tags = [...specialTags, ...recipeTags];
    this.filteredRecipes = [...recipes]; 
  }

  toggleTag(tag: string) {
    if (this.selectedTags.includes(tag)) {
      this.selectedTags = this.selectedTags.filter(t => t !== tag);
    } else {
      this.selectedTags.push(tag);
    }
    this.filterRecipes();
  }

  //ABSOLUTNÍ PEKLO, NEŠAHAT DO TOHO HLAVNĚ
  filterRecipes() {
    const recipes = this.recipeService.getRecipes();
  
    const filterByTags = this.selectedTags.filter(tag => !Object.values(PrepareTime).toString().includes(tag) && tag !== 'Oblíbené');
    let filteredRecipes = filterByTags.length > 0
      ? recipes.filter(recipe => recipe.tags.some(tag => filterByTags.includes(tag)))
      : recipes;
  
    const filterByPrepareTime = this.selectedTags.filter(tag => Object.values(PrepareTime).toString().includes(tag));
    filteredRecipes = filterByPrepareTime.length > 0
      ? filteredRecipes.filter(recipe => filterByPrepareTime.includes(recipe.prepareTime))
      : filteredRecipes;
  
    if (this.selectedTags.includes('Oblíbené')) {
      filteredRecipes = filteredRecipes.filter(recipe => recipe.isFavorite);
    }
  
    this.filteredRecipes = filteredRecipes;
  }
}
