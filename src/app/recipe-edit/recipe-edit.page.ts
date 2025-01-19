import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RecipeService } from '../services/recipe.service';
import { Recipe, RecipePhoto, PrepareTime } from '../models/recipe.model';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

@Component({
  selector: 'app-recipe-edit',
  templateUrl: './recipe-edit.page.html',
  styleUrls: ['./recipe-edit.page.scss'],
  //Tenhle bs tu je potřeba, jinak se to nezapne kvůli ionic generate page
  standalone: true,
  imports: [CommonModule, IonicModule, FormsModule]
})
export class RecipeEditPage implements OnInit {
  prepareTimeOptions = Object.values(PrepareTime);

  recipe: Recipe = {
    id: '',
    name: '',
    description: '',
    ingredients: [],
    steps: [],
    isFavorite: false,
    createdAt: 0,
    tags: [],
    photos: [],
    prepareTime: PrepareTime.None,
    defaultPortions: 0,
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
      this.router.navigate(['/recipe-details', this.recipe.id]);
    }
  }

  updateCaption(index: number, newCaption: string) {
    if (this.recipe?.photos[index]) {
      this.recipe.photos[index].caption = newCaption;
      this.recipeService.updateRecipe(this.recipe!);
    }
  }

  async addPhoto(fromGallery: boolean = false) {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.DataUrl,
      source: fromGallery ? CameraSource.Photos : CameraSource.Camera, // zdroj fotky
    });

    const newPhoto: RecipePhoto = {
      imageUrl: image.dataUrl || '', // Base64 
      caption: '',
    };

    this.recipe?.photos.push(newPhoto);
    this.recipeService.updateRecipe(this.recipe!); // save
  }
  

  deletePhoto(index: number) {
    const confirm = window.confirm('Přejete si zvolený obrázek odebrat?');
      if (confirm) {
        this.recipe?.photos.splice(index, 1); //delete
        this.recipeService.updateRecipe(this.recipe!);
      }
  }
}