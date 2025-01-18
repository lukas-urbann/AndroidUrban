import { Component } from '@angular/core';
import { RecipeService } from '../services/recipe.service';
import { Recipe } from '../models/recipe.model';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
  standalone: false,
})
export class Tab3Page {
  recipeCode: string = ''; // Uloží vstup od uživatele
  name = '';
  description = '';
  ingredients = '';
  steps = '';
  tags = '';

  constructor(
    private recipeService: RecipeService,
    private router: Router,
  ) {}

  ionViewWillEnter() {
    this.recipeCode = '';
    this.name = '';
    this.description = '';
    this.ingredients = '';
    this.steps = '';
    this.tags = '';
  }

  importRecipe() {
    try {
      const decodedData = decodeURIComponent(atob(this.recipeCode));
      const importedRecipe: Recipe = JSON.parse(decodedData);

      importedRecipe.name = importedRecipe.name + ' (importováno)';
      importedRecipe.id = Date.now().toString();
      importedRecipe.createdAt = Date.now();
      importedRecipe.isFavorite = false;

      this.recipeService.addRecipe(importedRecipe);
      alert('Recept byl úspěšně importován!');
      this.recipeCode = '';
    } catch (error) {
      alert('Kód receptu je neplatný!');
    }
  }
  
  addRecipe() {
    if (this.name && this.description) {
      const newRecipe: Recipe = {
        id: Date.now().toString(), // Generování unikátního ID
        name: this.name,
        description: this.description,
        ingredients: this.ingredients.split(','),
        steps: this.steps.split(','),
        isFavorite: false,
        createdAt: Date.now(),
        tags: this.tags.split(','),
        photos: [],
      };

      this.recipeService.addRecipe(newRecipe);
      alert('Recept přidán!');
      this.name = '';
      this.description = '';
      this.ingredients = '';
      this.steps = '';
      this.tags = '';


     this.router.navigate(['/tabs/tab1']);

    } else {
      alert('Vyplňte všechny potřebné údaje.');
    }
  }
}
