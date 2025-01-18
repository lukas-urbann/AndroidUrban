import { Component } from '@angular/core';
import { RecipeService } from '../services/recipe.service';
import { Recipe } from '../models/recipe.model';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  standalone: false,
})
export class Tab2Page {
  tags: string[] = [];
  selectedTags: string[] = [];
  filteredRecipes: Recipe[] = [];

  constructor(private recipeService: RecipeService) {}

  ionViewWillEnter() {
    const recipes = this.recipeService.getRecipes();
    this.tags = Array.from(new Set(recipes.flatMap(recipe => recipe.tags))); // Odstranění duplikátů
    
    const index = this.tags.indexOf(''); //ať tam není prázdný tag
    if (index !== -1) {
      this.tags.splice(index, 1);
    }

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

  filterRecipes() {
    const recipes = this.recipeService.getRecipes();
    if (this.selectedTags.length === 0) {
      this.filteredRecipes = [...recipes];
    } else {
      this.filteredRecipes = recipes.filter(recipe =>
        recipe.tags.some(tag => this.selectedTags.includes(tag))
      );
    }
  }
}
