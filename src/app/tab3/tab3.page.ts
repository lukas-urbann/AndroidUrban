import { Component } from '@angular/core';
import { RecipeService } from '../services/recipe.service';
import { Recipe, PrepareTime } from '../models/recipe.model';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
  standalone: false,
})
export class Tab3Page {
  prepareTimeOptions = Object.values(PrepareTime);

  recipeCode: string = ''; // Uloží vstup od uživatele
  name = '';
  description = '';
  ingredients = '';
  steps = '';
  tags = '';
  prepareTime = PrepareTime.None;
  defaultPortions = 0;

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
    this.defaultPortions = 0;
    this.prepareTime = PrepareTime.None;
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

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;

    const file = input.files[0];
    const reader = new FileReader();

    reader.onload = () => {
      const fileContent = reader.result as string;

      try {
        const decodedData = decodeURIComponent(atob(fileContent));
        const importedRecipe: Recipe = JSON.parse(decodedData);

        importedRecipe.name = importedRecipe.name + ' (importováno)';

        this.recipeService.addRecipe(importedRecipe);
        alert('Recept byl úspěšně importován ze souboru!');
      } catch (error) {
        alert('Soubor obsahuje neplatná data!');
      }
    };

    reader.onerror = () => {
      alert('Chyba při čtení souboru!');
    };

    reader.readAsText(file);
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
        defaultPortions: this.defaultPortions,
        prepareTime: this.prepareTime,
      };

      this.recipeService.addRecipe(newRecipe);
      alert('Recept přidán!');
      this.name = '';
      this.description = '';
      this.ingredients = '';
      this.steps = '';
      this.tags = '';
      this.defaultPortions = 0;
      this.prepareTime = PrepareTime.None;

     this.router.navigate(['/tabs/tab1']);

    } else {
      alert('Vyplňte všechny potřebné údaje.');
    }
  }
}
