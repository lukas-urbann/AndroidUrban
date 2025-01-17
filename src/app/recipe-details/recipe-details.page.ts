import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RecipeService } from '../services/recipe.service';
import { Recipe } from '../models/recipe.model';

@Component({
  selector: 'app-recipe-details',
  templateUrl: './recipe-details.page.html',
  styleUrls: ['./recipe-details.page.scss'],
  standalone: true, // Důležité pro standalone komponenty
  imports: [CommonModule, IonicModule] // Potřebné moduly
})
export class RecipeDetailsPage implements OnInit {
  recipe: Recipe | undefined;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private recipeService: RecipeService
  ) { }

  ngOnInit() {
    const recipeId = this.route.snapshot.paramMap.get('id'); // TOHLE SEŽERE TEN PARAMETR Z URL
    if (recipeId) {
      this.recipe = this.recipeService.getRecipe(recipeId);
    }
  }
}
