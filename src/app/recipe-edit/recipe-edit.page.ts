import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RecipeService } from '../services/recipe.service';
import { Recipe } from '../models/recipe.model';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-recipe-edit',
  templateUrl: './recipe-edit.page.html',
  styleUrls: ['./recipe-edit.page.scss'],
  //Tenhle bs tu je potřeba, jinak se to nezapne kvůli ionic generate page
  standalone: true,
  imports: [CommonModule, IonicModule, FormsModule]
})
export class RecipeEditPage implements OnInit {
  recipe: Recipe = {
    id: '',
    name: '',
    description: '',
    ingredients: [],
    steps: [],
    isFavorite: false,
    createdAt: 0,
    tags: []
  };

  ingredients: string = '';
  steps: string = '';
  tags: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private recipeService: RecipeService
  ) { }

  ngOnInit() {
    const recipeId = this.route.snapshot.paramMap.get('id');
    if (recipeId) {
    const loadedRecipe = this.recipeService.getRecipe(recipeId);
    if (loadedRecipe) {
      this.recipe = { ...loadedRecipe }; // Přepiš hodnoty receptu
      this.ingredients = this.recipe.ingredients.join(', ');
      this.steps = this.recipe.steps.join(', ');
      this.tags = this.recipe.tags.join(', ');
    }
  }
  }

  reloadPage() {
    setTimeout(()=>{
      window.location.reload();
    }, 100);
  }

  async saveRecipe() {
    if (!this.recipe?.name.trim() || !this.recipe?.description.trim()) {
      alert('Název a popis receptu jsou povinné!');
      return;
    }
    if (this.recipe) {
      this.recipe.ingredients = this.ingredients.split(',').map(i => i.trim());
      this.recipe.steps = this.steps.split(',').map(s => s.trim());
      this.recipe.tags = this.tags.split(',').map(tag => tag.trim());
      await this.recipeService.updateRecipe(this.recipe);
      this.router.navigate(['/tabs/tab1']);
      //this.reloadPage();
    }
  }
}