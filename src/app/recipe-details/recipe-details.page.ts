import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule, DatePipe } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RecipeService } from '../services/recipe.service';
import { Recipe, RecipePhoto } from '../models/recipe.model';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-recipe-details',
  templateUrl: './recipe-details.page.html',
  styleUrls: ['./recipe-details.page.scss'],
  //Tenhle bs tu je potřeba, jinak se to nezapne kvůli ionic generate page
  standalone: true,
  imports: [CommonModule, IonicModule, DatePipe, FormsModule ]
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
      if (this.recipe) {
        this.recipe.photos = this.recipe.photos || []; // definice fotek, jinak rip aplikace
      }
    }
  }

  async addPhoto() {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Camera,
    });

    const newPhoto: RecipePhoto = {
      imageUrl: image.dataUrl || '', // Base64
      caption: '', // caption k tomu
    };

    this.recipe?.photos.push(newPhoto);
    this.recipeService.updateRecipe(this.recipe!);
  }

  deletePhoto(index: number) {
    this.recipe?.photos.splice(index, 1); //delete
    this.recipeService.updateRecipe(this.recipe!);
  }

  updateCaption(index: number, newCaption: string) {
    if (this.recipe?.photos[index]) {
      this.recipe.photos[index].caption = newCaption;
      this.recipeService.updateRecipe(this.recipe!);
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
