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
  //Tenhle bs tu je potřeba, jinak se to nezapne kvůli ionic generate page
  standalone: true,
  imports: [CommonModule, IonicModule]
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

  async deleteRecipe() {
    if (this.recipe) {
      const confirm = window.confirm('Opravdu chcete tento recept odstranit?');
      if (confirm) {
        await this.recipeService.deleteRecipe(this.recipe.id);
        this.router.navigate(['/tabs/tab1']);
        this.reloadPage();
      }
    }
  }

  reloadPage() {
    setTimeout(()=>{
      window.location.reload();
    }, 100);
  }

  editRecipe() {
    if (this.recipe) {
      this.router.navigate(['/recipe-edit', this.recipe.id]);
    }
  }
}
