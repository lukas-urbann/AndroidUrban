import { Component, OnInit, isDevMode } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule, DatePipe } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RecipeService } from '../services/recipe.service';
import { Recipe } from '../models/recipe.model';
import { FormsModule } from '@angular/forms';
import { Share } from '@capacitor/share';
import { Clipboard } from '@capacitor/clipboard';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';

@Component({
  selector: 'app-recipe-details',
  templateUrl: './recipe-details.page.html',
  styleUrls: ['./recipe-details.page.scss'],
  //Tenhle bs tu je potřeba, jinak se to nezapne kvůli ionic generate page
  standalone: true,
  imports: [CommonModule, IonicModule, DatePipe, FormsModule ]
})
export class RecipeDetailsPage implements OnInit {
  isDevMode: boolean = false;
  recipe: Recipe | undefined;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private recipeService: RecipeService
  ) { }

  ionViewWillEnter() {
    this.ngOnInit();
  }

  ngOnInit() {
    this.isDevMode = isDevMode();
    const recipeId = this.route.snapshot.paramMap.get('id'); // TOHLE SEŽERE TEN PARAMETR Z URL
    if (recipeId) {
      this.recipe = this.recipeService.getRecipe(recipeId);
      if (this.recipe) {
        this.recipe.photos = this.recipe.photos || []; // definice fotek, jinak rip aplikace
      }
    }
  }

  async downloadDev() {
    if (!this.recipe)
      {
        alert('Neplatný recept!');
        return;
      }

      const shareText = await this.generateShareText();

      const blob = new Blob([shareText], { type: 'text/plain' });

      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `${this.recipe.name}.txt`;
      link.click();

      URL.revokeObjectURL(link.href);
  }      

  async generateShareText() {
    const recipeData = JSON.stringify(this.recipe);
    const encodedData = this.encodeToBase64(recipeData);
    return encodedData;
  }

  async generateShareTextNoPhoto() {
    const recipeCopy = JSON.parse(JSON.stringify(this.recipe));
    recipeCopy.photos = [];
    const recipeData = JSON.stringify(recipeCopy);
    const encodedData = this.encodeToBase64(recipeData);
    return encodedData;
  }

  async shareRecipeClipboard() {
    if (!this.recipe)
    {
      alert('Neplatný recept!');
      return;
    }

    const shareText = await this.generateShareTextNoPhoto();

    await Clipboard.write({
      string: shareText,
    });

    alert('Recept byl zkopírován do schránky!');
  }

  async shareRecipeNative() {
    if (!this.recipe)
      {
        alert('Neplatný recept!');
        return;
      }

      const shareText = await this.generateShareTextNoPhoto();

      await Share.share({
        title: 'Sdílení receptu',
        text: shareText,
        dialogTitle: 'Sdílet přes...',
      });
  }

  async shareRecipeFile() {
    if (!this.recipe)
      {
        alert('Neplatný recept!');
        return;
      }

      let saveText = '';

      const confirm = window.confirm('Má se recept uložit jako importovatelný soubor?');
      if (confirm) {
        saveText = await this.generateShareText();
      } else {
        /*
        saveText = `
        Recept: ${this.recipe.name}
        
        Popis:
        ${this.recipe.description}
        
        Ingredience:
        ${this.recipe.ingredients.join('\n')}
        
        Kroky přípravy:
        ${this.recipe.steps.join('\n')}
        
        Tagy:
        ${this.recipe.tags.join(', ')}
        
        Fotky:
        ${this.recipe.photos.map((photo, index) => `Fotka ${index + 1}: ${photo.caption}`).join('\n')}
          `;
          */
        return;
      }

      const fileName = `${this.recipe.name}.txt`;
      const result = await Filesystem.writeFile({
        path: fileName,
        data: saveText,
        directory: Directory.Documents,
        encoding: Encoding.UTF8,
      });

      console.log('Soubor uložen: ', result.uri);

      await Share.share({
        title: `Recept pro ${this.recipe.name}`,
        text: `Sdílení importovatelného receptu: ${this.recipe.name}`,
        url: result.uri,
        dialogTitle: 'Sdílet recept',
      });
    
      alert('Recept byl uložen jako importovatelný soubor!');
  }

  reloadPage() {
    setTimeout(()=>{
      window.location.reload();
    }, 100);
  }

  encodeToBase64(data: string): string {
    return btoa(encodeURIComponent(data));
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

  editRecipe() {
    if (this.recipe) {
      this.router.navigate(['/recipe-edit', this.recipe.id]);
    }
  }
}
